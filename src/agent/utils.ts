import { HttpStatus } from "@nestjs/common";

export class DuplicateEmailError extends Error {
  constructor() {
    super('Email already exists');
  }

  get httpCode() {
    return HttpStatus.CONFLICT
  }
}
