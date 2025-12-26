<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Handle case where product might be null (race condition or deleted product)
        $product = null;
        if ($this->relationLoaded('product') && $this->product) {
            $product = (new ProductResource($this->product))->resolve();
        }
        
        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'product' => $product,
        ];
    }
}
