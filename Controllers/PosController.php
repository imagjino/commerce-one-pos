<?php

declare(strict_types=1);

namespace Imagjino\POS\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Imagjino\Additional\Models\Labels\Label;
use Imagjino\Pos\Helpers\PosOrderService;
use Imagjino\Pos\Requests\StorePosOrderRequest;
use Imagjino\Products\Models\Product;
use Imagjino\Settings\Models\Country;
use Imagjino\Settings\Models\Currency;
use Imagjino\Settings\Models\PaymentMethod;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

final readonly class PosController
{
    public function __construct(
        private PosOrderService $posOrderService,
    )
    {
    }

    /**
     * Return Inertia view of POS
     */
    public function index(): Response
    {
        $paymentMethods = PaymentMethod::query()->whereActive(true)->select(['id', 'name', 'image'])->get();
        $cities = Country::query()->with(['cities'])->get();
        $labels = Label::query()->whereActive(true)->get();
        $products = Product::query()
            ->with([
                'brand:id,brand_name',
                'categories:id,category',
                'images:id,product_id,url,alt',
                'variants' => function ($query) {
                    $query->where('quantity', '>', 0)
                        ->with([
                            'options',
                            'variantPrice:id,variant_id,final_price,sale_price,price,point_price,point_reward,transport_price,personalised_price,start_sale_date,end_sale_date,mobile_discount,use_points,is_on_sale',
                        ]);
                },
            ])
            ->select(['products.id', 'products.brand_id', 'products.name', 'products.has_variants'])
            ->limit(15)
            ->get();

        $currency = Currency::query()->whereIsPrimary(true)->first();

        return Inertia::render('POS::index', [
            'paymentMethods' => $paymentMethods,
            'cities' => $cities,
            'labels' => $labels,
            'products' => $products,
            'currency' => $currency,
        ]);
    }

    /**
     * Store orders
     *
     * @throws Throwable
     */
    public function store(StorePosOrderRequest $request): RedirectResponse
    {
        DB::beginTransaction();

        $this->posOrderService->store($request);

        DB::commit();

        return back();
    }
}
