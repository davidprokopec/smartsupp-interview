import type { Config } from 'drizzle-kit';
import env from 'src/utils/env';

export default {
  schema: './src/drizzle/schema.ts',
  out: './drizzle',
  driver: 'pg',
  breakpoints: true,
  dbCredentials: {
    connectionString: env.DB_URL,
  },
} satisfies Config;
