# Restaurant Ordering System - Deployment Guide

## Overview

This guide covers deploying the Restaurant Ordering System using Docker to various cloud platforms including Render, Railway, Heroku, Fly.io, and others.

## Features

- ✅ Mint theme as primary color scheme (saved in database.json)
- ✅ Full-stack Node.js application with React frontend
- ✅ File-based database (JSON) for easy deployment
- ✅ Docker support for containerized deployment
- ✅ Production-ready with health checks and security headers
- ✅ Support for multiple deployment platforms

## Quick Deploy

### 1. Render (Recommended - Free Tier Available)

```bash
# Connect your GitHub repository to Render
# Use the render.yaml file for automatic configuration
```

**Steps:**
1. Connect GitHub repo to Render
2. The `render.yaml` file will automatically configure the service
3. Set environment variables: `NODE_ENV=production`
4. Deploy! 🚀

### 2. Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

### 3. Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy
fly launch
fly deploy
```

### 4. Heroku

```bash
# Create app and deploy
heroku create your-restaurant-app
heroku stack:set container
git push heroku main
```

### 5. Docker (Local/VPS)

```bash
# Build and run
docker build -t restaurant-app .
docker run -p 5000:5000 restaurant-app

# Or use docker-compose
docker-compose up -d
```

## Environment Variables

```bash
NODE_ENV=production
PORT=5000
```

## Features Included

### 🎨 Mint Theme Configuration
- Primary color: HSL(160, 84%, 39%) - Beautiful mint green
- Complementary colors for cards, buttons, and UI elements
- Saved in `database.json` for persistence
- Responsive design with glassmorphism effects

### 📱 Restaurant Management System
- Menu item management with categories
- Order tracking and management
- Admin panel for banner and restaurant settings
- Image upload and storage
- CSV export for orders and data

### 🔒 Production Ready
- Security headers via nginx proxy
- Health checks and monitoring
- Gzip compression
- Static file caching
- Error handling and logging

## Deployment Files

- `Dockerfile` - Multi-stage build for production
- `docker-compose.yml` - Local development and production
- `nginx.conf` - Reverse proxy configuration
- `render.yaml` - Render.com configuration
- `railway.json` - Railway.app configuration
- `heroku.yml` - Heroku container deployment
- `fly.toml` - Fly.io configuration

## Database

The application uses a file-based JSON database (`server/data/database.json`) which includes:
- Restaurant information
- Menu categories and food items
- Orders and order history
- Theme settings (mint theme)
- Banner configurations

This makes deployment simple as no external database setup is required.

## Monitoring and Health Checks

All deployment configurations include health checks on `/api/restaurant` endpoint to ensure the application is running properly.

## Support

For deployment issues, check the logs in your chosen platform or run locally with Docker to debug.