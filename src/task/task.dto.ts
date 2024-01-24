import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const newTaskScheme = z.object({
  name: z.string().max(30),
  description: z.string().max(200),
  durationMinutes: z.number().int().positive(), // minutes
  agentId: z.number().int().positive(),
});

export class NewTaskDto extends createZodDto(newTaskScheme) {}

const completeTaskScheme = z.object({
  taskId: z.number().int().positive(),
});

export class CompleteTaskDto extends createZodDto(completeTaskScheme) {}
