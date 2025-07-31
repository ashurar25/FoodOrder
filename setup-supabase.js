
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function setupSupabase() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL is not set');
      return false;
    }

    console.log('🚀 Setting up Supabase database...');
    const sql = neon(databaseUrl);

    // Run database migrations
    console.log('📋 Running database migrations...');
    
    // Read and execute the initial migration
    const fs = require('fs');
    const path = require('path');
    
    const migrationPath = path.join(__dirname, 'drizzle', '0001_initial.sql');
    if (fs.existsSync(migrationPath)) {
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      // Split by semicolon and execute each statement
      const statements = migrationSQL.split(';').filter(s => s.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await sql([statement]);
            console.log('✅ Executed:', statement.substring(0, 50) + '...');
          } catch (error) {
            if (!error.message.includes('already exists')) {
              console.error('❌ Migration error:', error.message);
            }
          }
        }
      }
    }

    console.log('🎉 Supabase database setup completed!');
    return true;

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    return false;
  }
}

setupSupabase().then(success => {
  if (success) {
    console.log('\n✅ You can now use Supabase as your main database!');
    console.log('Run "npm run dev" to start the application');
  } else {
    console.log('\n❌ Setup failed. Please check your configuration');
  }
  process.exit(success ? 0 : 1);
});
