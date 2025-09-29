'use client';

import CustomInput from '@/components/input/custom-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocale } from '@/contexts/locale';
import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import ProductSearchView from '../../../../Products/resources/js/pages/edit/components/similar-products/product-search-view';
import { Cart } from './components/cart';
import { CustomerDialog } from './components/customer-dialog';
import { Products } from './components/products';
import { CartItem, Customer, POSProps, Product, ProductVariant } from './data';

export function Form({ products, currency, paymentMethods, labels }: POSProps) {
    const { t } = useTranslation('POS');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const { currentLocale } = useLocale();

    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [selectedDialogProduct, setSelectedDialogProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [dialogQuantity, setDialogQuantity] = useState(1);
    const [dialogPrice, setDialogPrice] = useState(0);

    /**
     * Called when a product is selected from search or grid
     */
    const handleSelectProduct = (product: Product) => {
        if (!product) return;

        if (product.has_variants) {
            setSelectedDialogProduct(product);
            setSelectedVariant(product.variants[0]);
            setDialogQuantity(1);
            setDialogPrice(product.variants[0].variant_price.final_price);
            setIsProductDialogOpen(true);
        } else {
            addToCart(product, product.variants[0], 1, product.variants[0].variant_price.final_price);
        }
    };

    /**
     * Add item to cart
     */
    const addToCart = (product: Product, variant?: ProductVariant, quantity = 1, customPrice?: number) => {
        const effectivePrice = customPrice || variant?.variant_price.final_price || product.variants[0].variant_price.final_price;

        const stockQuantity = variant ? variant.quantity : product.variants[0].quantity;
        const existingItem = cart.find((item) => item.product.id === product.id && (variant ? item.variant?.id === variant.id : !item.variant));

        if (existingItem) {
            const newQuantity = Math.min(existingItem.quantity + quantity, stockQuantity);
            setCart(cart.map((item) => (item.id === existingItem.id ? { ...item, quantity: newQuantity } : item)));
        } else {
            const newQuantity = Math.min(quantity, stockQuantity);
            setCart([
                ...cart,
                {
                    id: `${product.id}-${variant?.id ?? 'default'}-${Date.now()}`,
                    product,
                    variant,
                    quantity: newQuantity,
                    unitPrice: effectivePrice,
                    discount: 0,
                },
            ]);
        }
    };

    /**
     * Confirm add from dialog
     */
    const handleAddFromDialog = () => {
        if (selectedDialogProduct) {
            addToCart(selectedDialogProduct, selectedVariant || undefined, dialogQuantity, dialogPrice);
            setIsProductDialogOpen(false);
            setSelectedDialogProduct(null);
            setSelectedVariant(null);
        }
    };

    const handleVariantChange = (variantId: string) => {
        if (selectedDialogProduct?.variants) {
            const variant = selectedDialogProduct.variants.find((v) => v.id === Number(variantId));
            if (variant) {
                setSelectedVariant(variant);
                setDialogPrice(variant.variant_price.final_price);
            }
        }
    };

    const { setData, data, post, processing, reset, errors, clearErrors } = useForm({
        customer_id: '',
        payment_method_id: '',
        order_status_id: '',
        subtotal: 0,
        label_value: 0,
        discount_value: 0,
        total: 0,
        origin: '',
    });

    const storeOrder: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('pos.order.store'), {
            preserveScroll: true,
            onSuccess: () => orderCreated(),
            // onFinish: () => reset(),
        });
    };

    const orderCreated = () => {
        toast(t('order_added_successfully'), { position: 'top-right', duration: 2000 });
    };

    return (
        <form className="space-y-6" onSubmit={storeOrder}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <ProductSearchView<Product>
                                handleSelectProduct={handleSelectProduct}
                                found={[]}
                                endpoint={route('pos.order.product-search')}
                            />
                        </div>

                        <CustomerDialog setSelectedCustomer={setSelectedCustomer} />
                    </div>

                    {selectedCustomer && (
                        <Card>
                            <CardContent className="flex items-center justify-between p-4">
                                <CustomInput
                                    type="hidden"
                                    id="customer_id"
                                    value={selectedCustomer.id}
                                    placeholder={t('customer_id')}
                                    setFormData={setData}
                                    errorMessage={errors.customer_id}
                                />
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

                    <Products products={products} currency={currency} cart={cart} setCart={setCart} paymentMethods={paymentMethods} labels={labels} />
                </div>

                <Cart
                    cart={cart}
                    setCart={setCart}
                    currency={currency}
                    currentLocale={currentLocale}
                    paymentMethods={paymentMethods}
                    labels={labels}
                />

                {/* Product dialog */}
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedDialogProduct?.name[currentLocale]}</DialogTitle>
                        </DialogHeader>

                        {selectedDialogProduct && (
                            <div className="space-y-4">
                                {selectedDialogProduct.variants && selectedDialogProduct.variants.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Variant</Label>
                                        <Select value={selectedVariant?.id.toString()} onValueChange={handleVariantChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select variant" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {selectedDialogProduct.variants.map((variant) => (
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
                                    <Label>Quantity</Label>
                                    <Input type="number" value={dialogQuantity} onChange={(e) => setDialogQuantity(Number(e.target.value))} min={1} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Price</Label>
                                    <Input type="number" value={dialogPrice} onChange={(e) => setDialogPrice(Number(e.target.value))} min={0} />
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button onClick={handleAddFromDialog}>Add to cart</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </form>
    );
}
