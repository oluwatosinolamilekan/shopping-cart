<?php

use App\Jobs\DailySalesReport;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new DailySalesReport())->dailyAt('18:00');
