<?php

declare(strict_types=1);

namespace Imagjino\POS\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

final class SearchPosProductRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'key' => ['required', 'string'],
            'excluded' => ['nullable', 'array'],

        ];
    }
}
