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
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private ProductRepository $productRepository
    ) {}

    public function index(FilterProductsRequest $request): Response
    {
        $filters = ProductFilterDTO::fromRequest($request);
        
        // Get filtered products from repository
        $products = $this->productRepository->getFilteredProducts(
            search: $filters->search,
            category: $filters->category,
            minPrice: $filters->minPrice,
            maxPrice: $filters->maxPrice,
            sortBy: $filters->sortBy,
            sortOrder: $filters->sortOrder,
            perPage: 10
        );
        
        $response = new ProductIndexResponse($products, $filters);
        
        // Get all categories for filter dropdown
        $categories = CategoryResource::collection(
            Category::orderBy('name')->get()
        )->resolve();
        
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
        $product->load('category');
        
        return Inertia::render('Products/Show', [
            'product' => (new ProductResource($product))->resolve(),
        ]);
    }
}
