#!/bin/bash

# Restaurant Ordering System - Docker Deployment Script
# This script builds and deploys the application using Docker

set -e

echo "🐳 Docker Deployment for Restaurant Ordering System"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Build Docker image
echo "🔨 Building Docker image..."
docker build -t restaurant-ordering-system .

# Create data volume for persistence
echo "📦 Creating data volume..."
docker volume create restaurant-data

# Stop and remove existing container if it exists
echo "🧹 Cleaning up existing containers..."
docker stop restaurant-app 2>/dev/null || true
docker rm restaurant-app 2>/dev/null || true

# Run the container
echo "🚀 Starting application container..."
docker run -d \
  --name restaurant-app \
  -p 5000:5000 \
  -v restaurant-data:/app/server/data \
  -e NODE_ENV=production \
  -e PORT=5000 \
  --restart unless-stopped \
  restaurant-ordering-system

# Wait for the application to start
echo "⏳ Waiting for application to start..."
sleep 10

# Check if the application is running
if curl -f http://localhost:5000/api/restaurant > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo ""
    echo "🌐 Application URL: http://localhost:5000"
    echo "🎨 Theme: Mint green"
    echo "📊 Admin Panel: http://localhost:5000/admin"
    echo ""
    echo "📋 Container Info:"
    docker ps --filter name=restaurant-app
    echo ""
    echo "📊 To view logs: docker logs restaurant-app"
    echo "🛑 To stop: docker stop restaurant-app"
    echo "🗑️  To remove: docker rm restaurant-app"
else
    echo "❌ Application failed to start. Check logs:"
    docker logs restaurant-app
    exit 1
fi