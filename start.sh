#!/usr/bin/env bash
# Render start script

echo "🚀 Starting Banking App..."

# Run database migrations
echo "🗄️  Running database migrations..."
php artisan migrate --force

# Seed the database with demo data
echo "🌱 Seeding database..."
php artisan db:seed --class=BankingSeeder --force

# Clear and cache configurations
echo "⚡ Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start the Laravel server
echo "🌐 Starting web server on port $PORT..."
php artisan serve --host=0.0.0.0 --port=$PORT
