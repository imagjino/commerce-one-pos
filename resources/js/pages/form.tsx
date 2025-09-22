'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Banknote, CreditCard, Minus, Percent, Plus, Scan, Search, Smartphone, Trash2, User } from 'lucide-react';
import { useState } from 'react';

interface ProductVariant {
    id: string;
    name: string;
    price: number;
    stock: number;
    sku: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    barcode: string;
    stock: number;
    variants?: ProductVariant[];
}

interface CartItem {
    id: string;
    product: Product;
    variant?: ProductVariant;
    quantity: number;
    unitPrice: number;
    discount: number;
}

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    loyaltyPoints: number;
}

const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Wireless Headphones',
        price: 99.99,
        image: '/wireless-headphones.png',
        category: 'Electronics',
        barcode: '123456789012',
        stock: 15,
        variants: [
            { id: '1-black', name: 'Black', price: 99.99, stock: 8, sku: 'WH-001-BLK' },
            { id: '1-white', name: 'White', price: 99.99, stock: 5, sku: 'WH-001-WHT' },
            { id: '1-red', name: 'Red', price: 109.99, stock: 2, sku: 'WH-001-RED' },
        ],
    },
    {
        id: '2',
        name: 'USB-C Cable',
        price: 19.99,
        image: '/usb-cable.png',
        category: 'Accessories',
        barcode: '123456789013',
        stock: 50,
        variants: [
            { id: '2-1m', name: '1 meter', price: 19.99, stock: 25, sku: 'USB-001-1M' },
            { id: '2-2m', name: '2 meters', price: 24.99, stock: 15, sku: 'USB-001-2M' },
            { id: '2-3m', name: '3 meters', price: 29.99, stock: 10, sku: 'USB-001-3M' },
        ],
    },
    {
        id: '3',
        name: 'Phone Case',
        price: 24.99,
        image: '/colorful-phone-case-display.png',
        category: 'Accessories',
        barcode: '123456789014',
        stock: 30,
        variants: [
            { id: '3-clear', name: 'Clear', price: 24.99, stock: 12, sku: 'PC-001-CLR' },
            { id: '3-black', name: 'Black', price: 24.99, stock: 10, sku: 'PC-001-BLK' },
            { id: '3-blue', name: 'Blue', price: 27.99, stock: 8, sku: 'PC-001-BLU' },
        ],
    },
    {
        id: '4',
        name: 'Bluetooth Speaker',
        price: 79.99,
        image: '/bluetooth-speaker.png',
        category: 'Electronics',
        barcode: '123456789015',
        stock: 8,
    },
    {
        id: '5',
        name: 'Laptop Stand',
        price: 49.99,
        image: '/laptop-stand.png',
        category: 'Accessories',
        barcode: '123456789016',
        stock: 12,
    },
    {
        id: '6',
        name: 'Wireless Mouse',
        price: 39.99,
        image: '/wireless-mouse.png',
        category: 'Electronics',
        barcode: '123456789017',
        stock: 25,
    },
];

const mockCustomers: Customer[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        loyaltyPoints: 150,
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        loyaltyPoints: 320,
    },
];

export default function Form() {
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('card');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [dialogQuantity, setDialogQuantity] = useState(1);
    const [dialogPrice, setDialogPrice] = useState(0);

    const filteredProducts = mockProducts.filter(
        (product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm),
    );

    const addToCart = (product: Product, variant?: ProductVariant, quantity = 1, customPrice?: number) => {
        const effectivePrice = customPrice || variant?.price || product.price;
        const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;

        const existingItem = cart.find((item) => item.product.id === product.id && (variant ? item.variant?.id === variant.id : !item.variant));

        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item.id === existingItem.id
                        ? {
                              ...item,
                              quantity: item.quantity + quantity,
                          }
                        : item,
                ),
            );
        } else {
            setCart([
                ...cart,
                {
                    id: `${cartItemId}-${Date.now()}`,
                    product,
                    variant,
                    quantity,
                    unitPrice: effectivePrice,
                    discount: 0,
                },
            ]);
        }
    };

    const updateCartItem = (id: string, updates: Partial<CartItem>) => {
        setCart(cart.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    };

    const removeFromCart = (id: string) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const applyCoupon = () => {
        if (couponCode === 'SAVE10') {
            setAppliedCoupon({ code: couponCode, discount: 10 });
            setCouponCode('');
        } else if (couponCode === 'WELCOME20') {
            setAppliedCoupon({ code: couponCode, discount: 20 });
            setCouponCode('');
        }
    };

    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity - item.discount, 0);
    const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
    const tax = (subtotal - couponDiscount) * 0.08;
    const total = subtotal - couponDiscount + tax;

    const processPayment = () => {
        // Process payment logic here
        alert(`Payment of $${total.toFixed(2)} processed successfully via ${paymentMethod}!`);
        setCart([]);
        setSelectedCustomer(null);
        setAppliedCoupon(null);
        setIsCheckoutOpen(false);
    };

    const handleProductClick = (product: Product) => {
        if (product.variants && product.variants.length > 0) {
            setSelectedProduct(product);
            setSelectedVariant(product.variants[0]);
            setDialogQuantity(1);
            setDialogPrice(product.variants[0].price);
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
            const variant = selectedProduct.variants.find((v) => v.id === variantId);
            if (variant) {
                setSelectedVariant(variant);
                setDialogPrice(variant.price);
            }
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Product Selection Area */}
            <div className="space-y-4 lg:col-span-2">
                {/* Search and Actions */}
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
                    <Button size="lg" variant="outline" className="h-12 bg-transparent px-6">
                        <Scan className="mr-2 h-5 w-5" />
                        Scan
                    </Button>
                    <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" variant="outline" className="h-12 bg-transparent px-6">
                                <User className="mr-2 h-5 w-5" />
                                Customer
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Select Customer</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Input placeholder="Search customers..." />
                                <div className="max-h-60 space-y-2 overflow-y-auto">
                                    {mockCustomers.map((customer) => (
                                        <div
                                            key={customer.id}
                                            className="hover:bg-muted cursor-pointer rounded-lg border p-3"
                                            onClick={() => {
                                                setSelectedCustomer(customer);
                                                setIsCustomerDialogOpen(false);
                                            }}
                                        >
                                            <div className="font-medium">{customer.name}</div>
                                            <div className="text-muted-foreground text-sm">{customer.email}</div>
                                            <div className="text-primary text-sm">{customer.loyaltyPoints} points</div>
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full bg-transparent" variant="outline">
                                    Add New Customer
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Selected Customer */}
                {selectedCustomer && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{selectedCustomer.name}</div>
                                    <div className="text-muted-foreground text-sm">{selectedCustomer.email}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-primary text-sm font-medium">{selectedCustomer.loyaltyPoints} points</div>
                                    <Button size="sm" variant="ghost" onClick={() => setSelectedCustomer(null)}>
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Product Grid */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => (
                        <Card
                            key={product.id}
                            className="cursor-pointer transition-shadow hover:shadow-md"
                            onClick={() => handleProductClick(product)}
                        >
                            <CardContent className="p-4">
                                <img
                                    src={product.image || '/placeholder.svg'}
                                    alt={product.name}
                                    className="mb-3 h-32 w-full rounded-md object-cover"
                                />
                                <div className="space-y-2">
                                    <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-primary text-lg font-bold">${product.price}</span>
                                        <Badge variant="secondary" className="text-xs">
                                            {product.stock} left
                                        </Badge>
                                    </div>
                                    {product.variants && product.variants.length > 0 && (
                                        <Badge variant="outline" className="text-xs">
                                            {product.variants.length} variants
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Cart and Checkout */}
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
                                <div className="max-h-60 space-y-3 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
                                            <img
                                                src={item.product.image || '/placeholder.svg'}
                                                alt={item.product.name}
                                                className="h-12 w-12 rounded object-cover"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-sm font-medium">{item.product.name}</div>
                                                {item.variant && <div className="text-muted-foreground text-xs">{item.variant.name}</div>}
                                                <div className="text-muted-foreground text-sm">
                                                    ${item.unitPrice} × {item.quantity}
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

                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                                        <Button onClick={applyCoupon} disabled={!couponCode}>
                                            <Percent className="mr-1 h-4 w-4" />
                                            Apply
                                        </Button>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-secondary">Coupon: {appliedCoupon.code}</span>
                                            <span className="text-secondary">-{appliedCoupon.discount}%</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 border-t pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal:</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    {couponDiscount > 0 && (
                                        <div className="text-secondary flex justify-between text-sm">
                                            <span>Coupon Discount:</span>
                                            <span>-${couponDiscount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span>Tax (8%):</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                                        <span>Total:</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="lg" className="w-full">
                                            Checkout
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Complete Payment</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Payment Method</Label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <Button
                                                        variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                                                        onClick={() => setPaymentMethod('cash')}
                                                        className="flex h-16 flex-col gap-1"
                                                    >
                                                        <Banknote className="h-5 w-5" />
                                                        <span className="text-xs">Cash</span>
                                                    </Button>
                                                    <Button
                                                        variant={paymentMethod === 'card' ? 'default' : 'outline'}
                                                        onClick={() => setPaymentMethod('card')}
                                                        className="flex h-16 flex-col gap-1"
                                                    >
                                                        <CreditCard className="h-5 w-5" />
                                                        <span className="text-xs">Card</span>
                                                    </Button>
                                                    <Button
                                                        variant={paymentMethod === 'mobile' ? 'default' : 'outline'}
                                                        onClick={() => setPaymentMethod('mobile')}
                                                        className="flex h-16 flex-col gap-1"
                                                    >
                                                        <Smartphone className="h-5 w-5" />
                                                        <span className="text-xs">Mobile</span>
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="bg-muted space-y-2 rounded-lg p-4">
                                                <div className="flex justify-between text-sm">
                                                    <span>Items ({cart.length}):</span>
                                                    <span>${subtotal.toFixed(2)}</span>
                                                </div>
                                                {couponDiscount > 0 && (
                                                    <div className="text-secondary flex justify-between text-sm">
                                                        <span>Discount:</span>
                                                        <span>-${couponDiscount.toFixed(2)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-sm">
                                                    <span>Tax:</span>
                                                    <span>${tax.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                                                    <span>Total:</span>
                                                    <span>${total.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <Button size="lg" className="w-full" onClick={processPayment}>
                                                Process Payment - ${total.toFixed(2)}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Product Selection Dialog */}
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add to Cart</DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <img
                                    src={selectedProduct.image || '/placeholder.svg'}
                                    alt={selectedProduct.name}
                                    className="h-20 w-20 rounded-md object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium">{selectedProduct.name}</h3>
                                    <p className="text-muted-foreground text-sm">{selectedProduct.category}</p>
                                </div>
                            </div>

                            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Variant</Label>
                                    <Select value={selectedVariant?.id} onValueChange={handleVariantChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select variant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectedProduct.variants.map((variant) => (
                                                <SelectItem key={variant.id} value={variant.id}>
                                                    {variant.name} - ${variant.price} ({variant.stock} in stock)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Quantity</Label>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" onClick={() => setDialogQuantity(Math.max(1, dialogQuantity - 1))}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            type="number"
                                            value={dialogQuantity}
                                            onChange={(e) => setDialogQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                                            className="text-center"
                                            min="1"
                                        />
                                        <Button size="sm" variant="outline" onClick={() => setDialogQuantity(dialogQuantity + 1)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Unit Price</Label>
                                    <Input
                                        type="number"
                                        value={dialogPrice}
                                        onChange={(e) => setDialogPrice(Number.parseFloat(e.target.value) || 0)}
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                                <span className="font-medium">Total:</span>
                                <span className="text-lg font-bold">${(dialogPrice * dialogQuantity).toFixed(2)}</span>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsProductDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleAddFromDialog}
                                    disabled={selectedProduct.variants && selectedProduct.variants.length > 0 && !selectedVariant}
                                >
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
