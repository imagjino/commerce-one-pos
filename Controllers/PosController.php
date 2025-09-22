<?php

declare(strict_types=1);

namespace Imagjino\POS\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class PosController
{
    /**
     * Load cells
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json(['data' => []]);
    }
}
