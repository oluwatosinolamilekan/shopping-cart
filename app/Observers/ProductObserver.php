<?php

namespace App\Observers;

use App\Models\Product;
use App\Services\ProductCacheService;

class ProductObserver
{
    public function __construct(
        protected ProductCacheService $cacheService
    ) {}

    /**
     * Handle the Product "updated" event.
     * This will fire whenever a product is updated, including stock changes.
     */
    public function updated(Product $product): void
    {
        // Check if stock_quantity was changed
        if ($product->wasChanged('stock_quantity')) {
            $this->cacheService->clearProductCaches($product);
        }
    }

    /**
     * Handle the Product "created" event.
     */
    public function created(Product $product): void
    {
        $this->cacheService->clearProductCaches($product);
    }

    /**
     * Handle the Product "deleted" event.
     */
    public function deleted(Product $product): void
    {
        $this->cacheService->clearProductCaches($product);
    }
}

