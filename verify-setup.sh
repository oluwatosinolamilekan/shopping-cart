#!/bin/bash

# Shopping Cart Setup Verification Script

echo "🔍 Verifying Shopping Cart Project Setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check PHP version
echo "Checking PHP version..."
PHP_VERSION=$(php -v | head -n 1 | cut -d " " -f 2 | cut -d "." -f 1,2)
if (( $(echo "$PHP_VERSION >= 8.2" | bc -l) )); then
    check_pass "PHP version $PHP_VERSION (>= 8.2 required)"
else
    check_fail "PHP version $PHP_VERSION (>= 8.2 required)"
fi
echo ""

# Check Composer
echo "Checking Composer..."
if command -v composer &> /dev/null; then
    check_pass "Composer is installed"
else
    check_fail "Composer is not installed"
fi
echo ""

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    check_pass "Node.js $NODE_VERSION is installed"
else
    check_fail "Node.js is not installed"
fi
echo ""

# Check if .env exists
echo "Checking environment file..."
if [ -f .env ]; then
    check_pass ".env file exists"
else
    check_warn ".env file not found. Run: cp .env.example .env"
fi
echo ""

# Check if vendor directory exists
echo "Checking dependencies..."
if [ -d vendor ]; then
    check_pass "PHP dependencies installed"
else
    check_warn "PHP dependencies not installed. Run: composer install"
fi

if [ -d node_modules ]; then
    check_pass "Node.js dependencies installed"
else
    check_warn "Node.js dependencies not installed. Run: npm install"
fi
echo ""

# Check database
echo "Checking database..."
if [ -f database/database.sqlite ]; then
    check_pass "Database file exists"
    
    # Check if tables exist
    TABLE_COUNT=$(sqlite3 database/database.sqlite "SELECT count(*) FROM sqlite_master WHERE type='table';" 2>/dev/null)
    if [ "$TABLE_COUNT" -gt 5 ]; then
        check_pass "Database tables exist ($TABLE_COUNT tables)"
    else
        check_warn "Database may need migration. Run: php artisan migrate --seed"
    fi
else
    check_warn "Database file not found. Run: touch database/database.sqlite && php artisan migrate --seed"
fi
echo ""

# Check key files
echo "Checking key project files..."

FILES=(
    "app/Models/Product.php"
    "app/Models/CartItem.php"
    "app/Models/Order.php"
    "app/Models/OrderItem.php"
    "app/Http/Controllers/ProductController.php"
    "app/Http/Controllers/CartController.php"
    "app/Jobs/LowStockNotification.php"
    "app/Jobs/DailySalesReport.php"
    "app/Mail/LowStockAlert.php"
    "app/Mail/DailySalesReportMail.php"
    "resources/js/Pages/Products/Index.jsx"
    "resources/js/Pages/Cart/Index.jsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$file"
    else
        check_fail "$file not found"
    fi
done
echo ""

# Check built assets
echo "Checking frontend build..."
if [ -f public/build/manifest.json ]; then
    check_pass "Frontend assets built"
else
    check_warn "Frontend not built. Run: npm run build"
fi
echo ""

# Summary
echo "================================================"
echo "Setup Verification Complete!"
echo "================================================"
echo ""
echo "To run the application:"
echo "  1. composer dev    (runs all services)"
echo "  OR"
echo "  2. php artisan serve    (in terminal 1)"
echo "     php artisan queue:work    (in terminal 2)"
echo "     npm run dev    (in terminal 3)"
echo ""
echo "Access the app at: http://localhost:8000"
echo ""
echo "Default credentials:"
echo "  Admin: admin@example.com / password"
echo "  User:  test@example.com / password"
echo ""

