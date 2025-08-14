#!/bin/bash

# Restaurant Ordering System - Build Script
# This script builds the application for production deployment

set -e

echo "🏗️  Building Restaurant Ordering System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Create necessary directories
echo "📁 Creating data directories..."
mkdir -p server/data/images

# Set proper permissions
echo "🔒 Setting permissions..."
chmod -R 755 server/data

# Ensure mint theme is set in database
echo "🎨 Configuring mint theme..."
node -e "
const fs = require('fs');
const path = require('path');
const dbPath = path.join(process.cwd(), 'server', 'data', 'database.json');

try {
  let db = {};
  if (fs.existsSync(dbPath)) {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }
  
  // Ensure theme settings exist with mint theme
  db.themeSettings = {
    themeId: 'mint',
    updatedAt: new Date().toISOString()
  };
  
  // Ensure other required arrays exist
  db.restaurants = db.restaurants || [];
  db.categories = db.categories || [];
  db.foodItems = db.foodItems || [];
  db.banners = db.banners || [];
  db.orders = db.orders || [];
  db.orderItems = db.orderItems || [];
  db.users = db.users || [];
  
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('✅ Database configured with mint theme');
} catch (error) {
  console.log('⚠️  Warning: Could not configure database:', error.message);
}
"

echo "✅ Build completed successfully!"
echo ""
echo "🚀 Ready for deployment!"
echo "   - Frontend: dist/public"
echo "   - Backend: dist/index.js"
echo "   - Database: server/data/database.json"
echo ""
echo "📋 Next steps:"
echo "   1. Choose your deployment platform (Render, Railway, Fly.io, etc.)"
echo "   2. Follow the deployment guide in deploy/README.md"
echo "   3. Set NODE_ENV=production environment variable"
echo ""
echo "🎨 Theme: Mint green is configured as the primary theme"