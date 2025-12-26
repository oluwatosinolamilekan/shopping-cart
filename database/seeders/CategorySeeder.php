<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'slug' => 'electronics',
                'description' => 'Electronic devices and gadgets including headphones, speakers, and smart devices.',
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'description' => 'Tech accessories including stands, cables, cases, and other peripheral items.',
            ],
            [
                'name' => 'Gaming',
                'slug' => 'gaming',
                'description' => 'Gaming peripherals and equipment for enhanced gaming experience.',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}

