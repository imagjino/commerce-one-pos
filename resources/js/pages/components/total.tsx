'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TotalProps } from '../data';

export function Total({ subtotal, couponDiscount, tax, total, labelTotal, currency, setData }: TotalProps) {
    const { t } = useTranslation('POS');

    useEffect(() => {
        if (setData) {
            setData('subtotal', subtotal);
            setData('discount_value', couponDiscount);
            setData('label_value', labelTotal);
            setData('total', total);
            setData('tax_value', tax);
        }
    }, [subtotal, couponDiscount, tax, total, labelTotal, setData]);

    return (
        <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
                <span>{t('subtotal')}:</span>
                <span>
                    {currency.symbol}
                    {subtotal.toFixed(2)}
                </span>
            </div>

            {couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                    <span>{t('coupon')}:</span>
                    <span>
                        -{currency.symbol}
                        {couponDiscount.toFixed(2)}
                    </span>
                </div>
            )}

            {labelTotal > 0 && (
                <div className="flex justify-between text-sm">
                    <span>{t('labels_total')}:</span>
                    <span>
                        {currency.symbol}
                        {labelTotal.toFixed(2)}
                    </span>
                </div>
            )}

            <div className="flex justify-between text-sm">
                <span>{t('tax')} (8%):</span>
                <span>
                    {currency.symbol}
                    {tax.toFixed(2)}
                </span>
            </div>

            <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>{t('total')}:</span>
                <span>
                    {currency.symbol}
                    {(total + labelTotal).toFixed(2)}
                </span>
            </div>
        </div>
    );
}
