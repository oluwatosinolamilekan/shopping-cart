# Quick Start Guide

This guide will help you get the shopping cart application up and running quickly.

## Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js and npm
- SQLite (or MySQL/PostgreSQL)

## Setup Steps

### 1. Database Setup

The migrations have already been run with sample data. If you need to reset:

```bash
php artisan migrate:fresh --seed --force
```

This creates:
- 10 sample products (some with low stock for testing)
- Admin user: admin@example.com / password
- Test user: test@example.com / password

### 2. Environment Configuration

Make sure your `.env` file is configured properly:

```env
APP_NAME="Shopping Cart"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (SQLite is default)
DB_CONNECTION=sqlite

# Queue (database driver)
QUEUE_CONNECTION=database

# Mail (use 'log' for development to see emails in logs)
MAIL_MAILER=log
# OR use Mailpit for local testing
# MAIL_MAILER=smtp
# MAIL_HOST=127.0.0.1
# MAIL_PORT=1025
```

### 3. Running the Application

#### Option A: Use Composer Dev Script (Recommended)

This runs all necessary services in one command:

```bash
composer dev
```

This starts:
- Laravel server (http://localhost:8000)
- Queue worker (for background jobs)
- Vite dev server (for hot reload)
- Pail log viewer

#### Option B: Manual Start (Multiple Terminals)

Terminal 1 - Laravel Server:
```bash
php artisan serve
```

Terminal 2 - Queue Worker:
```bash
php artisan queue:work
```

Terminal 3 - Vite Dev Server:
```bash
npm run dev
```

Terminal 4 - Scheduler (for daily reports):
```bash
php artisan schedule:work
```

### 4. Access the Application

Open your browser and go to: http://localhost:8000

You'll be redirected to the login page. Use either:
- test@example.com / password (regular user)
- admin@example.com / password (admin user)

## Testing Key Features

### 1. Shopping Cart
1. Login with test user
2. Browse products on the Products page
3. Add items to cart (try different quantities)
4. View your cart
5. Update quantities or remove items
6. Proceed to checkout

### 2. Low Stock Notification

The system sends an email alert when a product's stock drops to 10 or below.

To test:
1. Find a product with stock quantity > 10
2. Add enough to cart to bring it below 10
3. Complete checkout
4. Check the queue is processing: `php artisan queue:work`
5. View the email in logs: `tail -f storage/logs/laravel.log`

Products with low stock already in database:
- Laptop Stand (8 units)
- Mechanical Keyboard (5 units)
- Webcam HD (3 units)

### 3. Daily Sales Report

The report runs daily at 6:00 PM. To test immediately:

```bash
# Run all scheduled tasks
php artisan schedule:run

# OR dispatch the job directly
php artisan tinker
>>> App\Jobs\DailySalesReport::dispatch();
```

Check the email in: `storage/logs/laravel.log`

### 4. Stock Management

- Products show current stock on listing page
- Low stock items are highlighted in red
- Out of stock items cannot be added to cart
- Cart validation prevents ordering more than available stock

## Troubleshooting

### Queue not processing

Make sure the queue worker is running:
```bash
php artisan queue:work
```

Check failed jobs:
```bash
php artisan queue:failed
```

### Email not sending

For development, use log driver:
```env
MAIL_MAILER=log
```

Then check: `storage/logs/laravel.log`

### Frontend not updating

Clear cache and rebuild:
```bash
npm run build
php artisan optimize:clear
```

### Database issues

Reset database:
```bash
php artisan migrate:fresh --seed --force
```

## Project Structure

```
app/
├── Http/Controllers/
│   ├── CartController.php      # Cart operations
│   └── ProductController.php   # Product listing
├── Jobs/
│   ├── LowStockNotification.php    # Low stock alerts
│   └── DailySalesReport.php        # Daily reports
├── Mail/
│   ├── LowStockAlert.php          # Email template
│   └── DailySalesReportMail.php   # Email template
└── Models/
    ├── Product.php
    ├── CartItem.php
    ├── Order.php
    └── OrderItem.php

resources/
├── js/
│   └── Pages/
│       ├── Products/
│       │   └── Index.jsx       # Product listing
│       └── Cart/
│           └── Index.jsx       # Shopping cart
└── views/
    └── emails/                 # Email templates

database/
├── migrations/                 # Database schema
└── seeders/                   # Sample data
```

## API Endpoints

All routes require authentication:

- `GET /products` - List products
- `POST /cart/add` - Add to cart
- `GET /cart` - View cart
- `PATCH /cart/{id}` - Update cart item
- `DELETE /cart/{id}` - Remove from cart
- `POST /cart/checkout` - Complete order

## Production Notes

For production deployment:

1. Set proper environment:
```env
APP_ENV=production
APP_DEBUG=false
```

2. Use Redis for queue:
```env
QUEUE_CONNECTION=redis
```

3. Set up proper mail service (SendGrid, Mailgun, etc.)

4. Configure supervisor for queue worker

5. Add cron job for scheduler:
```bash
* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
```

6. Run optimization commands:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build
```

## Support

For issues or questions, please check:
- Laravel docs: https://laravel.com/docs
- Inertia.js docs: https://inertiajs.com
- React docs: https://react.dev

