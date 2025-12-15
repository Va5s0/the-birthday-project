#!/bin/bash

# Birthday Project - Setup Script
# This script helps you set up the project for the first time

set -e

echo "Birthday Project - Setup"
echo "========================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed!"
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "ERROR: Docker Compose is not installed!"
    echo "Please install Docker Compose from: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "Docker is installed"
echo ""

# Copy environment files if they don't exist
if [ ! -f .env ]; then
    echo "Creating frontend .env file..."
    cp .env.example .env
    echo "Created .env - You can edit this file to customize settings"
else
    echo "WARNING: .env already exists - skipping"
fi

if [ ! -f server/.env ]; then
    echo "Creating backend .env file..."
    cp server/.env.example server/.env
    echo "Created server/.env - You can edit this file to customize settings"
    echo ""
    echo "IMPORTANT: Update JWT secrets in server/.env for security!"
    echo "Run: openssl rand -base64 32"
    echo ""
else
    echo "WARNING: server/.env already exists - skipping"
fi

echo ""
echo "Setup complete! You can now:"
echo ""
echo "   1. Start the application:"
echo "      docker-compose up"
echo ""
echo "   2. Or start in detached mode:"
echo "      docker-compose up -d"
echo ""
echo "   3. View logs:"
echo "      docker-compose logs -f"
echo ""
echo "   4. Stop the application:"
echo "      docker-compose down"
echo ""
echo "The app will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5001"
echo ""
echo "First-time users: Create an account to get started!"
echo ""
