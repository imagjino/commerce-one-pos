<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Imagjino\POS\Controllers\PosController;

Route::prefix('pos')
    ->as('pos.')
    ->middleware(['web', 'auth'])
    ->group(function () {

        Route::get('/order/create', [PosController::class, 'index'])->name('order.create')->permission('pos.order.create');
    });

