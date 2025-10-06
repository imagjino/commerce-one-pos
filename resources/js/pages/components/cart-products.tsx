'use client';

import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartProductsProps } from '../data';

export function CartProducts({ cart, currency, currentLocale, updateCartItem, removeFromCart }: CartProductsProps) {
    return (
        <div className="max-h-60 space-y-3 overflow-y-auto">
            {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <img src={item.product.images[0]?.url} alt={item.product.images[0]?.alt} className="h-12 w-12 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{item.product.name[currentLocale]}</div>
                        <div className="text-muted-foreground text-sm">
                            {currency.symbol} {item.unitPrice.toFixed(2)} × {item.quantity}
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                if (item.quantity > 1) updateCartItem(item.id, { quantity: item.quantity - 1 });
                                else removeFromCart(item.id);
                            }}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                const maxQuantity = item.product.variants[0]?.quantity || 100;
                                if (item.quantity < maxQuantity) updateCartItem(item.id, { quantity: item.quantity + 1 });
                            }}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
