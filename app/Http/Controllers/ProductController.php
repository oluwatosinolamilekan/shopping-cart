<?php

namespace App\Http\Controllers;

use App\DTOs\ProductFilterDTO;
use App\Http\Requests\Products\FilterProductsRequest;
use App\Http\Resources\ProductResource;
use App\Http\Resources\CategoryResource;
use App\Http\Responses\ProductIndexResponse;
use App\Models\Product;
use App\Models\Category;
use App\Repositories\ProductRepository;
use App\Services\ProductCacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private ProductRepository $productRepository,
        private ProductCacheService $cacheService
    ) {}

    public function index(FilterProductsRequest $request): Response
    {
        $filters = ProductFilterDTO::fromRequest($request);
        $page = $request->input('page', 1);
        
        // Generate cache key using the service
        $cacheKey = $this->cacheService->generateCacheKey(
            search: $filters->search,
            category: $filters->category,
            minPrice: $filters->minPrice,
            maxPrice: $filters->maxPrice,
            sortBy: $filters->sortBy,
            sortOrder: $filters->sortOrder,
            page: $page
        );
        
        // Cache the filtered products
        $products = Cache::remember($cacheKey, $this->cacheService->getCacheDuration(), function () use ($filters) {
            return $this->productRepository->getFilteredProducts(
                search: $filters->search,
                category: $filters->category,
                minPrice: $filters->minPrice,
                maxPrice: $filters->maxPrice,
                sortBy: $filters->sortBy,
                sortOrder: $filters->sortOrder,
                perPage: 10
            );
        });
        
        $response = new ProductIndexResponse($products, $filters);
        
        // Cache categories
        $categories = Cache::remember('categories:all', $this->cacheService->getCacheDuration(), function () {
            return CategoryResource::collection(
                Category::orderBy('name')->get()
            )->resolve();
        });
        
        $cartCount = auth()->user()->cartItems()->sum('quantity');
        
        return Inertia::render('Products/Index', [
            'products' => ProductResource::collection($response->getProducts())->resolve(),
            'pagination' => $response->getPagination(),
            'filters' => $response->getFilters(),
            'categories' => $categories,
            'cartCount' => $cartCount,
        ]);
    }

    public function show(Product $product): Response
    {
        // Cache individual product
        $cachedProduct = Cache::remember(
            "product:{$product->id}", 
            $this->cacheService->getCacheDuration(), 
            function () use ($product) {
                $product->load('category');
                return $product;
            }
        );
        
        return Inertia::render('Products/Show', [
            'product' => (new ProductResource($cachedProduct))->resolve(),
        ]);
    }
}
