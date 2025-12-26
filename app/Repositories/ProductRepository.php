<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class ProductRepository
{
    /**
     * Find a product by ID
     */
    public function findById(int $productId): ?Product
    {
        return Product::find($productId);
    }

    /**
     * Find a product by ID or fail
     */
    public function findByIdOrFail(int $productId): Product
    {
        return Product::findOrFail($productId);
    }

    /**
     * Get all products
     */
    public function getAll(): Collection
    {
        return Product::all();
    }

    /**
     * Get paginated products
     */
    public function getPaginated(int $perPage = 15)
    {
        return Product::paginate($perPage);
    }

    /**
     * Update product stock quantity
     */
    public function updateStock(Product $product, int $quantity): bool
    {
        $product->stock_quantity = $quantity;
        return $product->save();
    }

    /**
     * Decrease product stock
     */
    public function decreaseStock(Product $product, int $quantity): bool
    {
        $product->stock_quantity -= $quantity;
        return $product->save();
    }

    /**
     * Check if product has sufficient stock
     */
    public function hasSufficientStock(Product $product, int $requestedQuantity): bool
    {
        return $product->stock_quantity >= $requestedQuantity;
    }

    /**
     * Check if product is low on stock
     */
    public function isLowStock(Product $product): bool
    {
        return $product->isLowStock();
    }

    /**
     * Get filtered and paginated products
     */
    public function getFilteredProducts(
        ?string $search = null,
        ?string $category = null,
        ?string $minPrice = null,
        ?string $maxPrice = null,
        string $sortBy = 'name',
        string $sortOrder = 'asc',
        int $perPage = 10
    ) {
        return Product::with('category')
            ->applyFilters($search, $category, $minPrice, $maxPrice)
            ->orderBy($sortBy, $sortOrder)
            ->paginate($perPage)
            ->withQueryString();
    }
}

