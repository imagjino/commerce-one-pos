'use client';

import CustomInput from '@/components/input/custom-input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useLocale } from '@/contexts/locale';
import { useTranslation } from 'react-i18next';
import type { POSProps } from './data';

export function Form({ products }: POSProps) {
    const { t } = useTranslation('POS');

    const { currentLocale } = useLocale();

    return (
        <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
                <h1 className="text-card-foreground text-3xl font-bold">POS</h1>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <CustomInput id="search" placeholder={t('search')} />

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                        {products.data.map((product) => {
                            return (
                                <div key={product.id} className="flex flex-col items-center gap-2 rounded border p-2">
                                    <img src={product.images[0].url} alt={product.name[currentLocale]} className="h-24 w-24 rounded object-cover" />

                                    <div className="text-center font-semibold">{product.name[currentLocale]}</div>

                                    <div className="text-muted-foreground text-center text-sm">{product.brand.brand_name}</div>

                                    <div className="text-sm">{product.variants[0].quantity}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="space-y-6 lg:col-span-1">
                    <Card>
                        <CardHeader>{t('order_data')}</CardHeader>
                        <CardContent></CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
