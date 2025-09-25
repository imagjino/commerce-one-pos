'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocale } from '@/contexts/locale';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Product, ProductsProps, ProductVariant } from '../data';

export function Products({ products, currency, cart, setCart }: ProductsProps) {
    const { currentLocale } = useLocale();
    const { t } = useTranslation('POS');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [dialogQuantity, setDialogQuantity] = useState(1);
    const [dialogPrice, setDialogPrice] = useState(0);

    const handleProductClick = (product: Product) => {
        if (product.has_variants) {
            setSelectedProduct(product);
            setSelectedVariant(product.variants[0]);
            setDialogQuantity(1);
            setDialogPrice(product.variants[0].variant_price.final_price);
            setIsProductDialogOpen(true);
        } else {
            addToCart(product);
        }
    };

    const handleAddFromDialog = () => {
        if (selectedProduct) {
            addToCart(selectedProduct, selectedVariant || undefined, dialogQuantity, dialogPrice);
            setIsProductDialogOpen(false);
            setSelectedProduct(null);
            setSelectedVariant(null);
        }
    };

    const handleVariantChange = (variantId: string) => {
        if (selectedProduct?.variants) {
            const variant = selectedProduct.variants.find((v) => v.id === Number(variantId));
            if (variant) {
                setSelectedVariant(variant);
                setDialogPrice(variant.variant_price.final_price);
            }
        }
    };

    const addToCart = (product: Product, variant?: ProductVariant, quantity = 1, customPrice?: number) => {
        const effectivePrice = customPrice || variant?.variant_price.final_price || product.variants[0].variant_price.final_price;

        const cartItemId = variant ? `${product.id}-${variant.id}` : product.id.toString();
        const stockQuantity = variant ? variant.quantity : product.variants[0].quantity;

        const existingItem = cart.find((item) => item.product.id === product.id && (variant ? item.variant?.id === variant.id : !item.variant));

        if (existingItem) {
            const newQuantity = Math.min(existingItem.quantity + quantity, stockQuantity);
            setCart(
                cart.map((item) =>
                    item.id === existingItem.id
                        ? {
                              ...item,
                              quantity: newQuantity,
                          }
                        : item,
                ),
            );
        } else {
            const newQuantity = Math.min(quantity, stockQuantity);
            setCart([
                ...cart,
                {
                    id: `${cartItemId}-${Date.now()}`,
                    product,
                    variant,
                    quantity: newQuantity,
                    unitPrice: effectivePrice,
                    discount: 0,
                },
            ]);
        }
    };

    return (
        <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {products.data.map((product) => (
                    <Card key={product.id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => handleProductClick(product)}>
                        <CardContent className="p-4">
                            <img src={product.images?.[0]?.url} alt={product.images?.[0]?.alt} className="mb-3 h-32 w-full rounded-md object-cover" />
                            <div className="space-y-2">
                                <h3 className="line-clamp-2 text-sm font-medium">{product.name[currentLocale]}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-primary text-lg font-bold">
                                        {currency.symbol} {product.variants[0].variant_price.final_price.toFixed(2)}
                                    </span>
                                    <Badge variant="secondary" className="text-xs">
                                        {product.variants.reduce((sum, v) => sum + v.quantity, 0)} {t('left')}
                                    </Badge>
                                </div>
                                {product.variants.length > 1 && (
                                    <Badge variant="outline" className="text-xs">
                                        {product.variants.length} {t('variants')}
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Product dialog */}
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedProduct?.name[currentLocale]}</DialogTitle>
                    </DialogHeader>

                    {selectedProduct && (
                        <div className="space-y-4">
                            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                                <div className="space-y-2">
                                    <Label>{t('variant')}</Label>
                                    <Select value={selectedVariant?.id.toString()} onValueChange={handleVariantChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select variant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectedProduct.variants.map((variant) => (
                                                <SelectItem key={variant.id} value={variant.id.toString()}>
                                                    {variant.sku} - {currency.symbol}
                                                    {variant.variant_price.final_price} ({variant.quantity} in stock)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>{t('quantity')}</Label>
                                <Input type="number" value={dialogQuantity} onChange={(e) => setDialogQuantity(Number(e.target.value))} min={1} />
                            </div>

                            <div className="space-y-2">
                                <Label>{t('price')}</Label>
                                <Input type="number" value={dialogPrice} onChange={(e) => setDialogPrice(Number(e.target.value))} min={0} />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button onClick={handleAddFromDialog}>Add to cart</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
