import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { schema } from './drizzle/schema';
import env from './utils/env';

async function processMigration() {
  const postgresClient = new Client({
    connectionString: env.DB_URL,
  });

  await postgresClient.connect();

  const db = drizzle(postgresClient, { schema });

  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migration completed');
}

processMigration();
