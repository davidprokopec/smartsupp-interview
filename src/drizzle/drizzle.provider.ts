import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';
import { schema } from './schema';
import env from 'src/utils/env';

export const DrizzleAsyncProvider = 'drizzleProvider';

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    useFactory: async () => {
      const postgresClient = new Client({
        connectionString: env.DB_URL,
      });

      await postgresClient.connect();

      const db = drizzle(postgresClient, { schema });

      await migrate(db, { migrationsFolder: './drizzle' });

      return db;
    },
    exports: [DrizzleAsyncProvider],
  },
];
