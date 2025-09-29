'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { CheckoutProps, PaymentMethod } from '../data';
import { useTranslation } from 'react-i18next';

export function Checkout({
    cart,
    subtotal,
    couponDiscount,
    tax,
    total,
    currency,
    paymentMethod,
    setPaymentMethod,
    processPayment,
    paymentMethods,
    currentLocale,
}: CheckoutProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation('POS');

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full">
                    {t('checkout')}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('complete_payment')}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Payment Methods */}
                    <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {paymentMethods.map((method: PaymentMethod) => (
                                <Button
                                    key={method.id}
                                    variant={paymentMethod === method.id ? 'default' : 'outline'}
                                    onClick={() => setPaymentMethod(method.id)}
                                    className="flex h-16 flex-col items-center justify-center gap-1"
                                >
                                    {method.image && <img src={method.image} alt={method.name[currentLocale]} className="h-5 w-5" />}
                                    <span className="text-xs">{method.name[currentLocale]}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-muted space-y-2 rounded-lg p-4">
                        <div className="flex justify-between text-sm">
                            <span>
                                {t('items')} ({cart.length}):
                            </span>
                            <span>
                                {currency.symbol}
                                {subtotal.toFixed(2)}
                            </span>
                        </div>
                        {couponDiscount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span>{t('discount')}:</span>
                                <span>
                                    -{currency.symbol}
                                    {couponDiscount.toFixed(2)}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span>{t('tax')}:</span>
                            <span>
                                {currency.symbol}
                                {tax.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between border-t pt-2 text-lg font-bold">
                            <span>{t('total')}:</span>
                            <span>
                                {currency.symbol}
                                {total.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        onClick={() => {
                            if (!paymentMethod) return alert(t('select_payment'));
                            processPayment();
                            setIsOpen(false);
                        }}
                    >
                        {t('process_payment')} - {currency.symbol}
                        {total.toFixed(2)}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
