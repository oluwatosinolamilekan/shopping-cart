<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Get all categories
        $categories = Category::all();
        
        if ($categories->isEmpty()) {
            $this->command->warn('No categories found. Please run CategorySeeder first.');
            return;
        }

        // Map categories to product types and prefixes
        $categoryData = [
            'Electronics' => [
                'prefixes' => ['Wireless', 'Smart', 'Digital', 'Portable', 'USB-C', 'Bluetooth', 'HD', '4K'],
                'products' => ['Headphones', 'Earbuds', 'Speaker', 'Microphone', 'Webcam', 'Monitor', 'Smartwatch', 'Fitness Tracker', 'Smart Light', 'Smart Plug', 'Camera', 'Router', 'Modem'],
            ],
            'Accessories' => [
                'prefixes' => ['Premium', 'Ergonomic', 'Adjustable', 'Compact', 'Foldable', 'Durable'],
                'products' => ['Laptop Stand', 'Phone Stand', 'Tablet Stand', 'USB Hub', 'Cable', 'Charger', 'Power Bank', 'Tripod', 'Phone Case', 'Screen Protector', 'Stylus', 'Pen', 'Notebook', 'Backpack', 'Bag', 'Desk Lamp', 'Clock'],
            ],
            'Gaming' => [
                'prefixes' => ['Pro', 'Gaming', 'RGB', 'Mechanical', 'Wireless', 'High-Performance'],
                'products' => ['Keyboard', 'Mouse', 'Mousepad', 'Headphones', 'Controller', 'Chair', 'Desk'],
            ],
        ];

        // Unsplash image IDs for tech products
        $imageIds = [
            'photo-1505740420928-5e560c06d30e', // headphones
            'photo-1523275335684-37898b6baf30', // watch
            'photo-1527864550417-7fd91fc51a46', // laptop
            'photo-1587829741301-dc798b83add3', // keyboard
            'photo-1625948515291-69613efd103f', // usb hub
            'photo-1597872200969-2b65d56bd16b', // ssd
            'photo-1585508889969-d2a9f0f42e05', // webcam
            'photo-1601784551446-20c9e07cdbdb', // phone stand
            'photo-1608043152269-423dbba4e7e1', // speaker
            'photo-1593642532400-2682810df593', // laptop
            'photo-1572569511254-d8f925fe2cbb', // headphones
            'photo-1583394838336-acd977736f90', // mouse
            'photo-1616627547584-bf28cdeea433', // keyboard
            'photo-1624705002806-5d72df19c7ad', // monitor
            'photo-1585509133505-c9a927b99bb1', // gaming setup
        ];

        // Create 100 products with faker
        for ($i = 0; $i < 100; $i++) {
            // Pick a random category
            $category = $categories->random();
            $categoryName = $category->name;
            
            // Get appropriate product types and prefixes for this category
            $data = $categoryData[$categoryName] ?? [
                'prefixes' => ['Premium', 'Professional', 'Advanced'],
                'products' => ['Product', 'Item', 'Device'],
            ];
            
            $prefix = $faker->randomElement($data['prefixes']);
            $productType = $faker->randomElement($data['products']);
            
            $name = $prefix . ' ' . $productType;
            
            // Add extra descriptor sometimes for variety
            if ($faker->boolean(40)) {
                $descriptors = ['Pro', 'Plus', 'Ultra', 'Max', 'Elite', 'Premium', 'Advanced', 'Deluxe'];
                $name .= ' ' . $faker->randomElement($descriptors);
            }

            // Generate realistic description
            $features = [
                'high-quality construction',
                'long battery life',
                'fast charging',
                'wireless connectivity',
                'noise cancellation',
                'water resistance',
                'durable design',
                'ergonomic comfort',
                'plug and play',
                'universal compatibility',
                'premium materials',
                'sleek design',
                'advanced technology',
                'energy efficient',
                'easy to use',
            ];

            $feature1 = $faker->randomElement($features);
            $feature2 = $faker->randomElement(array_diff($features, [$feature1]));
            
            $description = ucfirst($faker->words(3, true)) . ' with ' . $feature1 . ' and ' . $feature2;

            Product::create([
                'name' => $name,
                'category_id' => $category->id,
                'description' => $description,
                'price' => $faker->randomFloat(2, 9.99, 999.99),
                'stock_quantity' => $faker->numberBetween(0, 200),
                'image_url' => 'https://images.unsplash.com/' . $faker->randomElement($imageIds) . '?w=400',
            ]);
        }
    }
}
