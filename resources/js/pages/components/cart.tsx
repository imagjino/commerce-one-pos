'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CartItem, CartProps, OrderLabel } from '../data';
import { CartProducts } from './cart-products';
import { Checkout } from './checkout';
import { Coupon } from './coupon';
import { Labels } from './labels';
import { Total } from './total';

export function Cart({
    cart,
    setCart,
    currency,
    currentLocale,
    paymentMethods,
    labels,
    storeOrder,
    setData,
    selectedCustomer,
    setSelectedCustomer,
}: CartProps) {
    const { t } = useTranslation('POS');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<number | null>(paymentMethods[0]?.id || null);
    const [cartLabels, setCartLabels] = useState<(OrderLabel & { quantity: number; id: string })[]>([]);

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity - (item.discount || 0), 0);
    const labelTotal = cartLabels.reduce((sum, label) => sum + label.price * label.quantity, 0);
    const discountValue = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
    const tax = (subtotal - discountValue + labelTotal) * 0.08;
    const total = subtotal - discountValue + labelTotal + tax;

    // Sync data to form
    useEffect(() => {
        if (setData) {
            setData(
                'products',
                cart.map((item) => {
                    const variant = item.variant || item.product.variants[0];
                    return {
                        variant_id: variant.id,
                        quantity: item.quantity,
                        unit_price: item.unitPrice,
                        discount: item.discount || 0,
                        transport: variant.variant_price.transport_price,
                        personalised: variant.variant_price.personalised_price,
                        total: item.unitPrice * item.quantity,
                        point_reward: 0,
                        personalised_text: '',
                        name: item.product.name,
                    };
                }),
            );

            setData(
                'labels',
                cartLabels.map((label) => ({
                    label_id: label.id,
                    name: label.name,
                    quantity: label.quantity,
                    price: label.price,
                    total: label.price * label.quantity,
                })),
            );

            setData('customer_id', selectedCustomer?.id);
            setData('payment_method_id', paymentMethod);
            setData('order_status_id', '2');
            setData('subtotal', subtotal);
            setData('discount_value', discountValue);
            setData('label_value', labelTotal);
            setData('tax_value', tax);
            setData('total', total);
        }
    }, [cart, cartLabels, appliedCoupon, subtotal, discountValue, labelTotal, tax, total, setData, selectedCustomer, paymentMethod]);

    const applyCoupon = () => {
        if (couponCode === 'SAVE10') setAppliedCoupon({ code: couponCode, discount: 10 });
        else if (couponCode === 'WELCOME20') setAppliedCoupon({ code: couponCode, discount: 20 });
        setCouponCode('');
    };

    const processPayment = () => {
        setCart([]);
        setCartLabels([]);
        setAppliedCoupon(null);
        setSelectedCustomer(null);
    };

    const updateCartItem = (id: string, updates: Partial<CartItem>) => {
        setCart(cart.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    };

    const removeFromCart = (id: string) => setCart(cart.filter((item) => item.id !== id));

    const updateLabelQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return setCartLabels(cartLabels.filter((label) => label.id !== id));
        setCartLabels(cartLabels.map((label) => (label.id === id ? { ...label, quantity } : label)));
    };

    const removeLabelFromCart = (id: string) => setCartLabels(cartLabels.filter((label) => label.id !== id));

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        {t('cart')} ({cart.length})
                        {cart.length > 0 && (
                            <Button
                                size="sm"
                                onClick={() => {
                                    setCart([]);
                                    setCartLabels([]);
                                    setAppliedCoupon(null);
                                }}
                            >
                                {t('clear_all')}
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {cart.length === 0 && cartLabels.length === 0 ? (
                        <p className="text-muted-foreground py-8 text-center">{t('cart_empty')}</p>
                    ) : (
                        <>
                            {/* Cart Products */}
                            {cart.length > 0 && (
                                <CartProducts
                                    cart={cart}
                                    currency={currency}
                                    currentLocale={currentLocale}
                                    updateCartItem={updateCartItem}
                                    removeFromCart={removeFromCart}
                                />
                            )}

                            {/* Coupon */}
                            <Coupon couponCode={couponCode} setCouponCode={setCouponCode} appliedCoupon={appliedCoupon} applyCoupon={applyCoupon} />

                            {/* Labels */}
                            <Labels
                                labels={labels}
                                cartLabels={cartLabels}
                                setCartLabels={setCartLabels}
                                updateLabelQuantity={updateLabelQuantity}
                                removeLabelFromCart={removeLabelFromCart}
                                currency={currency}
                                currentLocale={currentLocale}
                            />

                            {/* Totals */}
                            <Total
                                subtotal={subtotal}
                                couponDiscount={discountValue}
                                tax={tax}
                                total={total}
                                currency={currency}
                                labelTotal={labelTotal}
                            />

                            {/* Checkout */}
                            <Checkout
                                cart={cart}
                                subtotal={subtotal}
                                couponDiscount={discountValue}
                                tax={tax}
                                total={total}
                                currency={currency}
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                                processPayment={processPayment}
                                paymentMethods={paymentMethods}
                                currentLocale={currentLocale}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    storeOrder(paymentMethod);
                                }}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
