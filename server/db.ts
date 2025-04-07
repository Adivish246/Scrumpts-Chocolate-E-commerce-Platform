import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Create Postgres client
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString!);

// Create drizzle database instance with schema
export const db = drizzle(client, { schema });