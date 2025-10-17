<?php

declare(strict_types=1);

namespace Imagjino\POS\Helpers;

use Illuminate\Support\Str;
use Imagjino\Orders\Models\Order;
use Imagjino\Orders\Models\OrderLabel;
use Imagjino\Orders\Models\OrderProduct;
use Imagjino\POS\Requests\StorePosOrderRequest;
use Imagjino\Products\Models\Variant;
use Imagjino\Settings\Models\Currency;
use Throwable;

final class PosOrderService
{
    /**
     * Store POS order
     *
     * @throws Throwable
     */
    public function store(StorePosOrderRequest $request): void
    {
        $currency = Currency::whereId($request->currency_id)->value('exchange');

        $order = Order::create(array_merge(
            $request->validated(),
            [
                'exchange' => $currency,
                'token' => Str::uuid(),
            ]
        ));

        $pointReward = $this->storeProducts($order, $request->products);

        if (! empty($request->labels)) {
            $this->storeLabels($order, $request->labels);
        }

        $order->update(['point_reward' => $pointReward]);
    }

    /**
     * Store products and update variant stock
     */
    private function storeProducts(Order $order, array $products): int
    {
        $totalPointReward = 0;

        foreach ($products as $item) {
            OrderProduct::create([
                'order_id' => $order->id,
                'variant_id' => $item['variant_id'],
                'name' => json_encode($item['name']),
                'quantity' => $item['quantity'],
                'price' => $item['unit_price'],
                'discount_value' => $item['discount'],
                'transport_value' => $item['transport'],
                'personalised_value' => $item['personalised'],
                'total' => $item['total'],
                'point_reward' => $item['point_reward'],
                'personalised_text' => $item['personalised_text'],
            ]);

            $totalPointReward += $item['point_reward'];

            if ($item['variant_id']) {
                Variant::whereId($item['variant_id'])->decrement('quantity', $item['quantity']);
            }
        }

        return $totalPointReward;
    }

    /**
     * Store labels for order
     */
    private function storeLabels(Order $order, array $labels): void
    {
        foreach ($labels as $label) {
            OrderLabel::create([
                'order_id' => $order->id,
                'label_id' => $label['label_id'],
                'name' => json_encode($label['name']),
                'price' => $label['price'],
                'quantity' => $label['quantity'],
                'total' => $label['total'],
            ]);
        }
    }
}
