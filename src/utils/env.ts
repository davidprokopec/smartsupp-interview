import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  DB_URL: z.string().url(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().positive().max(65535),
  // TZ: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.log('Invalid environment variables', env.error.message);
  process.exit(1);
}

export default env.data;
