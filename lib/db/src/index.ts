import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

/* Netlify's managed Postgres add-on exposes the connection string as NETLIFY_DB_URL */
const connectionString = process.env.DATABASE_URL || process.env.NETLIFY_DB_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });

export * from "./schema";
