import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import { schema } from '../drizzle/schema';
import { NewTaskDto } from './task.dto';
import { AgentNotFoundError, TaskNotFoundError } from './utils';
import { eq } from 'drizzle-orm';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof schema>,
  ) {}

  async getAll() {
    const tasks = await this.db.select().from(schema.task);
    return tasks;
  }

  async addNew(newTask: NewTaskDto) {
    this.logger.debug(`Creating new task: ${JSON.stringify(newTask)}`);
    const agent = await this.db
      .select()
      .from(schema.agent)
      .where(eq(schema.agent.id, newTask.agentId))
      .limit(1);

    if (agent.length === 0) {
      this.logger.error(`Agent with id ${newTask.agentId} not found`);
      throw new AgentNotFoundError(newTask.agentId);
    }

    const duration = new Date();
    duration.setMinutes(duration.getMinutes() + newTask.duration);

    const task = await this.db
      .insert(schema.task)
      .values({
        name: newTask.name,
        description: newTask.description,
        expectedDurationMinutes: newTask.duration,
        agentId: agent[0].id,
      })
      .returning();
    return task;
  }

  async completeTask(taskId: number) {
    this.logger.debug(`time is `, new Date())
    this.logger.debug(`Completing task with id ${taskId}`);
    const task = await this.db
      .select()
      .from(schema.task)
      .where(eq(schema.task.id, taskId))
      .limit(1);

    if (task.length === 0) {
      this.logger.error(`Task with id ${taskId} not found`);
      throw new TaskNotFoundError(taskId);
    }

    const completedTask = await this.db
      .update(schema.task)
      .set({ doneAt: new Date() })
      .where(eq(schema.task.id, taskId))
      .returning();

    return completedTask;
  }
}
