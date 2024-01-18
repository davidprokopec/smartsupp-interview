import { Client } from 'pg';
import env from '../utils/env';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { schema } from './schema';

export async function getDb() {
  const postgresClient = new Client({ connectionString: env.DB_URL });

  await postgresClient.connect();

  const db = drizzle(postgresClient, { schema });

  return db;
}

export async function processMigrations() {
  console.log('Processing migrations...');
  const db = await getDb();
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations processed.');
}
