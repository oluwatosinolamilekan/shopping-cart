<?php

namespace App\Jobs;

use App\Enums\UserRole;
use App\Mail\LowStockAlert;
use App\Models\Product;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class LowStockNotification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Product $product
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $admin = User::where('role', UserRole::ADMIN)->first();
        
        if ($admin) {
            Mail::to($admin->email)->send(new LowStockAlert($this->product));
        }
    }
}
