'use client';

import CustomInput from '@/components/input/custom-input';
import { Button } from '@/components/ui/button';
import { Percent } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CouponProps } from '../data';

export function Coupon({ couponCode, setCouponCode, appliedCoupon, applyCoupon }: CouponProps) {
    const { t } = useTranslation('POS');

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
                <CustomInput
                    className="col-span-2"
                    id="couponCode"
                    placeholder={t('coupon_code')}
                    value={couponCode}
                    errorMessage={undefined}
                    setFormData={(_, value) => setCouponCode(value as string)}
                    hideLabel={true}
                />

                <Button size="sm" className="col-span-1" onClick={applyCoupon} disabled={!couponCode}>
                    <Percent className="sm" />
                    {t('apply')}
                </Button>
            </div>

            {appliedCoupon && (
                <div className="flex justify-between text-sm text-gray-900">
                    <span>
                        {t('coupon')}: {appliedCoupon.code}
                    </span>
                    <span>-{appliedCoupon.discount}%</span>
                </div>
            )}
        </div>
    );
}
