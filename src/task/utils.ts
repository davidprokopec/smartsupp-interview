import { HttpStatus } from '@nestjs/common';

export class AgentNotFoundError extends Error {
  constructor(id: number) {
    super(`Agent with id ${id} not found`);
  }

  get httpCode() {
    return HttpStatus.UNPROCESSABLE_ENTITY;
  }
}

export class TaskNotFoundError extends Error {
  constructor(id: number) {
    super(`Task with id ${id} not found`);
  }

  get httpCode() {
    return HttpStatus.UNPROCESSABLE_ENTITY;
  }
}

export class TaskAlreadyCompleted extends Error {
  constructor(id: number) {
    super(`Task with id ${id} already completed`);
  }

  get httpCode() {
    return HttpStatus.UNPROCESSABLE_ENTITY;
  }
}
