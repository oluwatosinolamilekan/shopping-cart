<?php

namespace App\Http\Responses;

use Illuminate\Pagination\LengthAwarePaginator;

class OrderIndexResponse
{
    public function __construct(
        private readonly LengthAwarePaginator $paginator,
    ) {}

    public function toArray(): array
    {
        return [
            'data' => $this->paginator->items(),
            'links' => $this->paginator->linkCollection()->toArray(),
            'meta' => $this->getMeta(),
        ];
    }

    private function getMeta(): array
    {
        return [
            'current_page' => $this->paginator->currentPage(),
            'from' => $this->paginator->firstItem(),
            'last_page' => $this->paginator->lastPage(),
            'path' => $this->paginator->path(),
            'per_page' => $this->paginator->perPage(),
            'to' => $this->paginator->lastItem(),
            'total' => $this->paginator->total(),
        ];
    }
}

