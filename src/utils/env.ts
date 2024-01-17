import { z } from 'zod';

const envSchema = z.object({
  DB_URL: z.string().url(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.log('Invalid environment variables', env.error.message)
  process.exit(1);
}

export default env.data;
