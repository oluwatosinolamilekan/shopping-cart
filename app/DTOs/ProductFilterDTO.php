<?php

namespace App\DTOs;

use App\Http\Requests\Products\FilterProductsRequest;

class ProductFilterDTO
{
    public function __construct(
        public readonly string $sortBy,
        public readonly string $sortOrder,
        public readonly string $search,
        public readonly string $category,
        public readonly string $minPrice,
        public readonly string $maxPrice,
    ) {}

    public static function fromRequest(FilterProductsRequest $request): self
    {
        return new self(
            sortBy: $request->getSortBy(),
            sortOrder: $request->getSortOrder(),
            search: $request->getSearch(),
            category: $request->getCategoryFilter(),
            minPrice: $request->getMinPrice(),
            maxPrice: $request->getMaxPrice(),
        );
    }

    public function toArray(): array
    {
        return [
            'sort_by' => $this->sortBy,
            'sort_order' => $this->sortOrder,
            'search' => $this->search,
            'category' => $this->category,
            'min_price' => $this->minPrice,
            'max_price' => $this->maxPrice,
        ];
    }
}

