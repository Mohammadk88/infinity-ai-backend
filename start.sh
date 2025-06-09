#!/bin/bash

# Infinity AI System - Quick Start Script
echo "🚀 Starting Infinity AI System Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env file created from template. Please configure your environment variables."
    else
        echo "❌ No .env.example found. Please create .env file manually."
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗃️  Running database migrations..."
npx prisma migrate deploy

# Seed database (optional)
echo "🌱 Seeding database..."
npx prisma db seed || echo "⚠️  Seeding failed or no seed script found"

# Start the application
echo "🎯 Starting the application..."
echo "📋 Available commands:"
echo "  - npm run start:dev    (Development mode with hot reload)"
echo "  - npm run start:prod   (Production mode)"
echo "  - npm run build        (Build for production)"
echo "  - npm run test         (Run tests)"
echo ""
echo "📚 Documentation available at: http://localhost:3001/docs"
echo "🌐 API Base URL: http://localhost:3001"
echo ""
echo "🔥 Starting in development mode..."
npm run start:dev
