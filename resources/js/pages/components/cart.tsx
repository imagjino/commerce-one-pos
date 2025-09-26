'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CartItem, CartProps } from '../data';
import { Checkout } from './checkout';
import { Coupon } from './coupon';
import { Total } from './total';

export function Cart({ cart, setCart, currency, currentLocale, paymentMethods }: CartProps) {
    const { t } = useTranslation('POS');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<number | null>(paymentMethods[0]?.id || null);

    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity - (item.discount || 0), 0);
    const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
    const tax = (subtotal - couponDiscount) * 0.08;
    const total = subtotal - couponDiscount + tax;

    const applyCoupon = () => {
        if (couponCode === 'SAVE10') setAppliedCoupon({ code: couponCode, discount: 10 });
        else if (couponCode === 'WELCOME20') setAppliedCoupon({ code: couponCode, discount: 20 });
        setCouponCode('');
    };

    const processPayment = () => {
        setCart([]);
        setAppliedCoupon(null);
    };

    const updateCartItem = (id: string, updates: Partial<CartItem>) => {
        setCart(cart.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    };

    const removeFromCart = (id: string) => setCart(cart.filter((item) => item.id !== id));

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        {t('cart')} ({cart.length})
                        {cart.length > 0 && (
                            <Button size="sm" onClick={() => setCart([])}>
                                {t('clear_all')}
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {cart.length === 0 ? (
                        <p className="text-muted-foreground py-8 text-center"> {t('cart_empty')}</p>
                    ) : (
                        <>
                            {/* Cart Items */}
                            <div className="max-h-60 space-y-3 overflow-y-auto">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
                                        <img
                                            src={item.product.images[0].url}
                                            alt={item.product.images[0].alt}
                                            className="h-12 w-12 rounded object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm font-medium">{item.product.name[currentLocale]}</div>
                                            <div className="text-muted-foreground text-sm">
                                                {currency.symbol} {item.unitPrice.toFixed(2)} × {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    if (item.quantity > 1) {
                                                        updateCartItem(item.id, { quantity: item.quantity - 1 });
                                                    } else {
                                                        removeFromCart(item.id);
                                                    }
                                                }}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    const maxQuantity = item.product.variants[0].quantity;
                                                    if (item.quantity < maxQuantity) {
                                                        updateCartItem(item.id, { quantity: item.quantity + 1 });
                                                    }
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

                            {/* Coupon */}
                            <Coupon couponCode={couponCode} setCouponCode={setCouponCode} appliedCoupon={appliedCoupon} applyCoupon={applyCoupon} />

                            {/* Totals */}
                            <Total subtotal={subtotal} couponDiscount={couponDiscount} tax={tax} total={total} currency={currency} />

                            {/* Checkout */}
                            <Checkout
                                cart={cart}
                                subtotal={subtotal}
                                couponDiscount={couponDiscount}
                                tax={tax}
                                total={total}
                                currency={currency}
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                                processPayment={processPayment}
                                paymentMethods={paymentMethods}
                                currentLocale={currentLocale}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
