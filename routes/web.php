<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Imagjino\Pos\Controllers\PosController;
use Imagjino\Pos\Controllers\PosProductSearchController;

Route::prefix('pos')
    ->as('pos.')
    ->middleware(['web', 'auth'])
    ->group(function () {

        Route::get('/order/create', [PosController::class, 'index'])->name('order.create')->permission('pos.order.create');
        Route::post('/order/create', [PosController::class, 'store'])->name('order.store')->permission('pos.order.create');

        Route::get('/product-search', PosProductSearchController::class)->name('order.product-search');
    });
