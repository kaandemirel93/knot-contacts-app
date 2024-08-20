#!/bin/bash

# Exit on error
set -e

# Step 1: Set up Laravel backend

echo "Setting up Laravel backend..."

# Install PHP dependencies
composer install

# Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Generate application key
php artisan key:generate

# Run migrations to create the database schema
php artisan migrate

# Step 2: Set up React frontend

echo "Setting up React frontend..."

# Navigate to the React directory
cd fe/knot-contacts-fe

# Install Node.js dependencies
npm install

# Build the React application
npm run build

# Step 3: Start the applications

echo "Starting Laravel backend..."
cd ../..
php artisan serve &
php artisan queue:work &

echo "Starting React frontend..."
cd fe/knot-contacts-fe
npm start &

echo "Applications are running. Laravel is on http://127.0.0.1:8000 and React is on http://localhost:3000"
