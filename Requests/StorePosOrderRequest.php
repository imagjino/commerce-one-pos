<?php

declare(strict_types=1);

namespace Imagjino\POS\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

final class StorePosOrderRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'customer_id' => ['nullable', 'integer'],
            'payment_method_id' => ['required', 'integer'],
            'currency_id' => ['nullable', 'string'],
            'order_status_id' => ['required', 'string'],
            'subtotal' => ['required', 'integer'],
            'label_value' => ['required', 'integer'],
            'discount_value' => ['required', 'integer'],
            'tax_value' => ['required', 'integer'],
            'total' => ['required', 'integer'],
            'origin' => ['required', 'string'],
            'products' => ['array'],
            'labels' => ['array'],
        ];
    }
}
