
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function testSupabaseConnection() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL is not set in environment variables');
      return false;
    }

    console.log('🔗 Testing Supabase connection...');
    console.log('Database URL:', databaseUrl.replace(/:[^:@]*@/, ':****@'));

    const sql = neon(databaseUrl);
    
    // Test basic connection
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Basic connection successful:', result);

    // Test database version
    const version = await sql`SELECT version()`;
    console.log('📋 PostgreSQL Version:', version[0].version.substring(0, 50) + '...');

    // Test table creation (will be used by Drizzle)
    await sql`
      CREATE TABLE IF NOT EXISTS connection_test (
        id SERIAL PRIMARY KEY,
        test_message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Table creation successful');

    // Test insert
    await sql`
      INSERT INTO connection_test (test_message) 
      VALUES ('Supabase connection test successful')
    `;
    console.log('✅ Insert operation successful');

    // Test select
    const testData = await sql`SELECT * FROM connection_test LIMIT 1`;
    console.log('✅ Select operation successful:', testData[0]);

    // Clean up test table
    await sql`DROP TABLE connection_test`;
    console.log('✅ Cleanup successful');

    console.log('🎉 All Supabase connection tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    console.error('Error details:', error);
    return false;
  }
}

testSupabaseConnection().then(success => {
  if (success) {
    console.log('\n✅ Supabase is ready to use as the main database!');
    process.exit(0);
  } else {
    console.log('\n❌ Please check your Supabase configuration');
    process.exit(1);
  }
});
