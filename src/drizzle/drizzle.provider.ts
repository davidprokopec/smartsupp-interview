import { getDb } from "./utils";

export const DrizzleAsyncProvider = "drizzleProvider";

export const drizzleProvider = [
	{
		provide: DrizzleAsyncProvider,
		useFactory: async () => {
			const db = await getDb();

			return db;
		},
		exports: [DrizzleAsyncProvider],
	},
];
