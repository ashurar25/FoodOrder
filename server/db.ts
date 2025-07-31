
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../shared/schema';

// Enable array mode for better compatibility
neonConfig.arrayMode = false;

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not set');
  console.log('Please add your Supabase connection string to the Secrets tool');
  process.exit(1);
}

// Create the connection
const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });

// Export pool for compatibility (not used with Neon)
export const pool = {};
