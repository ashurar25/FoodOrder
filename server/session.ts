import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { db } from './db';

// Function to create session store
export function createSessionStore() {
  // Check if DATABASE_URL is available for PostgreSQL sessions
  if (process.env.DATABASE_URL) {
    const pgStore = connectPgSimple(session);
    return new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      ttl: 7 * 24 * 60 * 60, // 7 days
      tableName: 'sessions',
    });
  } else {
    // Fallback to memory store for development
    const MemoryStore = session.MemoryStore;
    return new MemoryStore();
  }
}

// Session configuration
export function getSessionConfig() {
  return session({
    secret: process.env.SESSION_SECRET || 'restaurant-ordering-secret-key-dev',
    store: createSessionStore(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  });
}