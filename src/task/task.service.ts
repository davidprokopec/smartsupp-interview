import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import { schema } from '../drizzle/schema';
import { NewTaskDto } from './task.dto';
import {
  AgentNotFoundError,
  TaskAlreadyCompleted,
  TaskNotFoundError,
} from './utils';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof schema>,
    @InjectQueue('tasks') private overdueTaskQueue: Queue,
  ) {}

  async getAll() {
    const tasks = await this.db.select().from(schema.task);
    return tasks;
  }

  async addNew(newTask: NewTaskDto) {
    this.logger.debug(`Creating new task: ${JSON.stringify(newTask)}`);
    const [agent] = await this.db
      .select()
      .from(schema.agent)
      .where(eq(schema.agent.id, newTask.agentId))
      .limit(1);

    if (!agent) {
      this.logger.error(`Agent with id ${newTask.agentId} not found`);
      throw new AgentNotFoundError(newTask.agentId);
    }


    const expectedDone = new Date();
    expectedDone.setMinutes(expectedDone.getMinutes() + newTask.durationMinutes);

    const [task] = await this.db
      .insert(schema.task)
      .values({
        name: newTask.name,
        description: newTask.description,
        expectedTimeDone: expectedDone.toISOString(),
        agentId: agent.id,
      })
      .returning();

    return task;
  }

  async completeTask(taskId: number) {
    this.logger.debug(`Completing task with id ${taskId}`);
    const [task] = await this.db
      .select()
      .from(schema.task)
      .where(eq(schema.task.id, taskId))
      .limit(1);

    if (!task) {
      this.logger.error(`Task with id ${taskId} not found`);
      throw new TaskNotFoundError(taskId);
    }

    if (task.doneAt) {
      this.logger.error(`Task with id ${taskId} already completed`);
      throw new TaskAlreadyCompleted(taskId);
    }

    const now = new Date()

    const [completedTask] = await this.db
      .update(schema.task)
      .set({ doneAt: now.toISOString() })
      .where(eq(schema.task.id, taskId))
      .returning()
      .execute();

    return completedTask;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkTasksStatus() {
    const tasksNotDone = await this.db
      .select({
        id: schema.task.id,
        name: schema.task.name,
        expectedTimeDone: schema.task.expectedTimeDone,
        agentId: schema.task.agentId,
        agentName: schema.agent.name,
      })
      .from(schema.task)
      .leftJoin(schema.agent, eq(schema.task.agentId, schema.agent.id))
      .where(and(isNull(schema.task.doneAt), eq(schema.task.overdue, false)));

    if (tasksNotDone.length === 0) {
      return;
    }

    const overduteTasksIds: number[] = [];

    for (const task of tasksNotDone) {
      const expectedTimeDone = new Date(task.expectedTimeDone);
      const now = new Date();
      if (expectedTimeDone < now) {
        this.logger.warn(`Task with id ${task.id} is overdue, adding to queue`);
        await this.overdueTaskQueue.add('overdue', task);
        overduteTasksIds.push(task.id);
      }
    }

    if (overduteTasksIds.length === 0) {
      return;
    }

    await this.db
      .update(schema.task)
      .set({ overdue: true })
      .where(inArray(schema.task.id, overduteTasksIds));
  }
}
