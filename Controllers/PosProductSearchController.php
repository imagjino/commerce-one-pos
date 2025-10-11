<?php

declare(strict_types=1);

namespace Imagjino\Pos\Controllers;

use Illuminate\Http\JsonResponse;
use Imagjino\POS\Requests\SearchPosProductRequest;
use Imagjino\Products\Models\Product;

final class PosProductSearchController
{
    /**
     * Search products for POS
     */
    public function __invoke(SearchPosProductRequest $searchPosProductRequest): JsonResponse
    {
        $products = Product::query()
            ->where('name', 'LIKE', '%'.$searchPosProductRequest->key.'%')
            ->when($searchPosProductRequest->excluded, function ($query) use ($searchPosProductRequest) {
                $query->whereNotIn('id', $searchPosProductRequest->excluded);
            })
            ->with([
                'images:id,product_id,url,alt',
                'variants' => function ($query) {
                    $query->where('quantity', '>', 0)
                        ->with([
                            'options',
                            'variantPrice:id,variant_id,final_price,sale_price,price,point_price,point_reward,transport_price,personalised_price,start_sale_date,end_sale_date,mobile_discount,use_points,is_on_sale',
                        ]);
                },
            ])
            ->select(['products.id', 'products.name', 'images->featured->url as image', 'min_price', 'max_price', 'products.has_variants', 'in_stock'])
            ->limit(10)
            ->get();

        return response()->json(['products' => $products]);
    }
}
