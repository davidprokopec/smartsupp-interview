import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const newAgentSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export class NewAgentDto extends createZodDto(newAgentSchema) {}
