#!/bin/bash
php artisan migrate --force
php artisan db:seed --class=BankingSeeder --force
apache2-foreground