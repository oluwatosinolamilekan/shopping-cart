<?php

namespace App\Http\Responses;

use App\DTOs\ProductFilterDTO;
use App\Helpers\PaginationHelper;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductIndexResponse
{
    public function __construct(
        private readonly LengthAwarePaginator $paginator,
        private readonly ProductFilterDTO $filters,
    ) {}

    public function getPagination(): array
    {
        return PaginationHelper::getMetadata($this->paginator);
    }

    public function getFilters(): array
    {
        return $this->filters->toArray();
    }

    public function getProducts(): array
    {
        return $this->paginator->items();
    }
}

