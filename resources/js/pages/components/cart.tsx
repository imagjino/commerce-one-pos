'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Minus, Percent, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CartItem, CartProps } from '../data';
import { Checkout } from './checkout';

export function Cart({ cart, setCart, currency, currentLocale, paymentMethods }: CartProps) {
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
        const selectedMethod = paymentMethods.find((m) => m.id === paymentMethod);
        alert(`Payment of ${currency.symbol}${total.toFixed(2)} processed via ${selectedMethod?.name[currentLocale]}`);
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
                        Cart ({cart.length})
                        {cart.length > 0 && (
                            <Button size="sm" variant="ghost" onClick={() => setCart([])}>
                                Clear All
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {cart.length === 0 ? (
                        <p className="text-muted-foreground py-8 text-center">Cart is empty</p>
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
                                                onClick={() => updateCartItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => updateCartItem(item.id, { quantity: item.quantity + 1 })}
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
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                                    <Button onClick={applyCoupon} disabled={!couponCode}>
                                        <Percent className="mr-1 h-4 w-4" />
                                        Apply
                                    </Button>
                                </div>
                                {appliedCoupon && (
                                    <div className="text-secondary flex justify-between text-sm">
                                        <span>Coupon: {appliedCoupon.code}</span>
                                        <span>-{appliedCoupon.discount}%</span>
                                    </div>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="space-y-2 border-t pt-4">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span>
                                        {currency.symbol}
                                        {subtotal.toFixed(2)}
                                    </span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="text-secondary flex justify-between text-sm">
                                        <span>Discount:</span>
                                        <span>
                                            -{currency.symbol}
                                            {couponDiscount.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span>Tax (8%):</span>
                                    <span>
                                        {currency.symbol}
                                        {tax.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                                    <span>Total:</span>
                                    <span>
                                        {currency.symbol}
                                        {total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

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
