'use client';

import CustomInput from '@/components/input/custom-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocale } from '@/contexts/locale';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cart } from './components/cart';
import { CustomerDialog } from './components/customer-dialog';
import { Products } from './components/products';
import { CartItem, Customer, POSProps } from './data';

export function Form({ products, currency, paymentMethods }: POSProps) {
    const { t } = useTranslation('POS');
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const { currentLocale } = useLocale();

    const filteredProducts = products.data.filter(
        (product) => product.name[currentLocale].toLowerCase().includes(searchTerm.toLowerCase()) || product.variants[0].sku?.includes(searchTerm),
    );

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <CustomInput
                            id="productSearch"
                            placeholder={t('search_products')}
                            value={searchTerm}
                            errorMessage={undefined}
                            setFormData={(_, value) => setSearchTerm(value as string)}
                            hideLabel={true}
                        />
                    </div>

                    <CustomerDialog setSelectedCustomer={setSelectedCustomer} />
                </div>

                {selectedCustomer && (
                    <Card>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <div className="font-medium">
                                    {selectedCustomer.name} {selectedCustomer.surname}
                                </div>
                                <div className="text-muted-foreground text-sm">{selectedCustomer.phone_no}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-primary text-sm font-medium">
                                    {selectedCustomer.points} {t('points')}
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => setSelectedCustomer(null)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Products
                    products={{ ...products, data: filteredProducts }}
                    currency={currency}
                    cart={cart}
                    setCart={setCart}
                    paymentMethods={paymentMethods}
                />
            </div>

            <Cart cart={cart} setCart={setCart} currency={currency} currentLocale={currentLocale} paymentMethods={paymentMethods} />
        </div>
    );
}
