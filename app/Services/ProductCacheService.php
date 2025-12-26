<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class ProductCacheService
{
    /**
     * Cache duration in seconds (1 hour)
     */
    protected int $cacheDuration = 3600;

    /**
     * Clear all product-related caches
     */
    public function clearProductCaches(Product $product): void
    {
        // Clear individual product cache
        $this->clearProductCache($product->id);
        
        // Clear all product list caches
        $this->clearAllProductListCaches();
        
        // Clear categories cache
        $this->clearCategoriesCache();
    }

    /**
     * Clear individual product cache
     */
    public function clearProductCache(int $productId): void
    {
        Cache::forget("product:{$productId}");
    }

    /**
     * Clear categories cache
     */
    public function clearCategoriesCache(): void
    {
        Cache::forget('categories:all');
    }

    /**
     * Clear all product list caches
     */
    public function clearAllProductListCaches(): void
    {
        $cacheStore = Cache::getStore();
        
        // Try Redis pattern-based deletion first
        if ($this->clearRedisProductCaches($cacheStore)) {
            return;
        }
        
        // Fallback to clearing common cache keys
        $this->clearCommonProductCaches();
    }

    /**
     * Try to clear Redis caches using pattern matching
     */
    protected function clearRedisProductCaches($cacheStore): bool
    {
        if (!method_exists($cacheStore, 'getRedis')) {
            return false;
        }

        try {
            $redis = $cacheStore->getRedis();
            $prefix = config('cache.prefix') ? config('cache.prefix') . ':' : '';
            
            // Get all product cache keys
            $keys = $redis->keys($prefix . 'products:filtered:*');
            
            if (!empty($keys)) {
                // Remove prefix from keys before deleting
                $keysToDelete = array_map(function ($key) use ($prefix) {
                    return str_replace($prefix, '', $key);
                }, $keys);
                
                foreach ($keysToDelete as $key) {
                    Cache::forget($key);
                }
            }
            
            return true;
        } catch (\Exception $e) {
            // Log the error if needed
            // \Log::warning('Failed to clear Redis product caches: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Clear commonly accessed product caches
     * This is a fallback when pattern matching isn't available
     */
    protected function clearCommonProductCaches(): void
    {
        $sortOptions = ['name', 'price', 'created_at'];
        $sortOrders = ['asc', 'desc'];
        $pages = 20; // Clear first 20 pages
        
        // Clear default listings (no filters)
        foreach ($sortOptions as $sortBy) {
            foreach ($sortOrders as $sortOrder) {
                for ($page = 1; $page <= $pages; $page++) {
                    $key = $this->generateCacheKey(
                        search: null,
                        category: null,
                        minPrice: null,
                        maxPrice: null,
                        sortBy: $sortBy,
                        sortOrder: $sortOrder,
                        page: $page
                    );
                    Cache::forget($key);
                }
            }
        }
    }

    /**
     * Generate cache key for product listings
     */
    public function generateCacheKey(
        ?string $search,
        ?string $category,
        ?string $minPrice,
        ?string $maxPrice,
        string $sortBy,
        string $sortOrder,
        int $page
    ): string {
        return sprintf(
            'products:filtered:%s:%s:%s:%s:%s:%s:%d',
            $search ?? 'none',
            $category ?? 'none',
            $minPrice ?? 'none',
            $maxPrice ?? 'none',
            $sortBy,
            $sortOrder,
            $page
        );
    }

    /**
     * Get cache duration
     */
    public function getCacheDuration(): int
    {
        return $this->cacheDuration;
    }
}

