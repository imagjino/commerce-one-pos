<?php

declare(strict_types=1);

namespace Imagjino\POS;

use Illuminate\Support\ServiceProvider;

final class PosServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Notes categories
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__.'/routes/web.php');
    }
}
