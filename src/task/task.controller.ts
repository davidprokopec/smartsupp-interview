import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CompleteTaskDto, NewTaskDto } from './task.dto';
import {
  AgentNotFoundError,
  TaskAlreadyCompleted,
  TaskNotFoundError,
} from './utils';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getTasks() {
    const tasks = await this.taskService.getAll();
    return tasks;
  }

  @Put()
  async addTask(@Body() newTask: NewTaskDto) {
    try {
      const task = await this.taskService.addNew(newTask);
      return task;
    } catch (error) {
      if (error instanceof AgentNotFoundError) {
        throw new HttpException(error.message, error.httpCode);
      }
    }
  }

  @Post('/complete')
  async completeTask(@Body() completeTask: CompleteTaskDto) {
    try {
      const task = await this.taskService.completeTask(completeTask.taskId);
      return task;
    } catch (error: any) {
      if (
        error instanceof TaskNotFoundError ||
        error instanceof TaskAlreadyCompleted
      ) {
        throw new HttpException(error.message, error.httpCode);
      }
    }
  }
}
