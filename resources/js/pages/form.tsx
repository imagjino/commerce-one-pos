'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/contexts/locale';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Cart } from './components/cart';
import { CustomerDialog } from './components/customer-dialog';
import { Products } from './components/products';
import { CartItem, Customer, POSProps } from './data';

export function Form({ products, currency, paymentMethods }: POSProps) {
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
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input
                            placeholder="Search products or scan barcode..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-12 pl-10 text-lg"
                        />
                    </div>

                    <CustomerDialog setSelectedCustomer={setSelectedCustomer} />
                </div>

                {/* Selected Customer */}
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
                                <div className="text-primary text-sm font-medium">{selectedCustomer.points} points</div>
                                <Button size="sm" variant="ghost" onClick={() => setSelectedCustomer(null)}>
                                    Remove
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Products products={{ ...products, data: filteredProducts }} currency={currency} cart={cart} setCart={setCart} />
            </div>

            <Cart cart={cart} setCart={setCart} currency={currency} currentLocale={currentLocale} paymentMethods={paymentMethods} />
        </div>
    );
}
