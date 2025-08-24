#!/bin/bash

# Build script for Vercel deployment
echo "🚀 Starting build process..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Push database schema (this will sync the schema without requiring migrations)
echo "🗄️  Pushing database schema..."
npx prisma db push --accept-data-loss

# Seed the database
echo "🌱 Seeding database..."
npx prisma db seed

# Build the Next.js application
echo "🏗️  Building Next.js application..."
npx next build

echo "✅ Build completed successfully!"
