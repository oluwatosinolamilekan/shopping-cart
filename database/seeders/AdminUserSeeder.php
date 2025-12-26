<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'admin@admin.com',
                'password' => Hash::make('password'),
                'role' => UserRole::ADMIN,
            ],
            [
                'name' => 'Super Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role' => UserRole::ADMIN,
            ],
            [
                'name' => 'John Admin',
                'email' => 'john.admin@example.com',
                'password' => Hash::make('password'),
                'role' => UserRole::ADMIN,
            ],
            [
                'name' => 'Sarah Manager',
                'email' => 'sarah.manager@example.com',
                'password' => Hash::make('password'),
                'role' => UserRole::ADMIN,
            ],
            [
                'name' => 'Alice Johnson',
                'email' => 'alice@example.com',
                'password' => Hash::make('password'),
                'role' => UserRole::USER,
            ],
            [
                'name' => 'Bob Smith',
                'email' => 'bob@example.com',
                'password' => Hash::make('password'),
                'role' => UserRole::USER,
            ],
            [
                'name' => 'Charlie Brown',
                'email' => 'charlie@example.com',
                'password' => Hash::make('password'),
                'role' => UserRole::USER,
            ],
            [
                'name' => 'Diana Prince',
                'email' => 'diana@example.com',
                'password' => Hash::make('password'),
                'role' => UserRole::USER,
            ],
            [
                'name' => 'Ethan Hunt',
                'email' => 'ethan@example.com',
                'password' => Hash::make('password'),
                'role' => UserRole::USER,
            ],
            [
                'name' => 'Fiona Gallagher',
                'email' => 'fiona@example.com',
                'password' => Hash::make('password'),
                'role' => UserRole::USER,
            ],
            [
                'name' => 'George Miller',
                'email' => 'george@example.com',
                'password' => Hash::make('password'),
                'role' => UserRole::USER,
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }
    }
}
