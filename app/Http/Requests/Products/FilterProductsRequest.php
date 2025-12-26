<?php

namespace App\Http\Requests\Products;

use Illuminate\Foundation\Http\FormRequest;

class FilterProductsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'sort_by' => ['sometimes', 'string', 'in:name,price,created_at'],
            'sort_order' => ['sometimes', 'string', 'in:asc,desc'],
            'search' => ['sometimes', 'string', 'max:255'],
            'category' => ['sometimes', 'string', 'max:255'],
            'min_price' => ['sometimes', 'numeric', 'min:0'],
            'max_price' => ['sometimes', 'numeric', 'min:0', 'gte:min_price'],
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'sort_by' => 'sort field',
            'sort_order' => 'sort order',
            'search' => 'search term',
            'category' => 'category filter',
            'min_price' => 'minimum price',
            'max_price' => 'maximum price',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'sort_by.in' => 'The sort field must be one of: name, price, or created_at.',
            'sort_order.in' => 'The sort order must be either asc or desc.',
            'max_price.gte' => 'The maximum price must be greater than or equal to the minimum price.',
        ];
    }

    /**
     * Get validated sort_by with default value.
     */
    public function getSortBy(): string
    {
        return $this->validated('sort_by', 'created_at');
    }

    /**
     * Get validated sort_order with default value.
     */
    public function getSortOrder(): string
    {
        return $this->validated('sort_order', 'desc');
    }

    /**
     * Get validated search with default value.
     */
    public function getSearch(): string
    {
        return $this->validated('search', '');
    }

    /**
     * Get validated category filter with default value.
     */
    public function getCategoryFilter(): string
    {
        return $this->validated('category', '');
    }

    /**
     * Get validated min_price with default value.
     */
    public function getMinPrice(): string
    {
        return $this->validated('min_price', '');
    }

    /**
     * Get validated max_price with default value.
     */
    public function getMaxPrice(): string
    {
        return $this->validated('max_price', '');
    }
}

