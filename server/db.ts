
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../shared/schema';

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

let db: any = null;
let sql: any = null;

if (databaseUrl) {
  // Create the connection only if DATABASE_URL is available
  sql = neon(databaseUrl);
  db = drizzle(sql, { schema });
} else {
  console.log('DATABASE_URL not set, using file-based storage');
}

export { db, sql };

// Export pool for compatibility (not used with Neon)
export const pool = {};
