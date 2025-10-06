import type { BreadcrumbItem } from '@/types';
import { TranslatableField } from '@/types/helpers';
import { Dispatch, SetStateAction } from 'react';
import { route } from 'ziggy-js';

export const posBreadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'POS',
        href: route('pos.order.create'),
    },
];

export type ProductImage = {
    id: number;
    product_id: number;
    url: string;
    alt?: string;
};

export type VariantPrice = {
    id: number;
    variant_id: number;
    final_price: number;
    sale_price: number;
    price: number;
    point_price: number;
    point_reward: number;
    transport_price: number;
    personalised_price: number;
    start_sale_date?: string;
    end_sale_date?: string;
    mobile_discount: boolean;
    use_points: boolean;
    is_on_sale: boolean;
};

export type Option = {
    id: string;
    attribute_id: number;
    title: TranslatableField;
    url: string;
    order: string;
    value: string;
    is_primary: boolean;
};

export type ProductVariant = {
    id: number;
    product_id: number;
    quantity: number;
    sku: string;
    barcode: string;
    variant_price?: VariantPrice;
    options?: Option[];
};

export type ProductBrand = {
    id: number;
    brand_name: string;
};

export type ProductCategory = {
    id: number;
    category: TranslatableField;
};

export type Currency = {
    id: number;
    symbol: string;
    exchange: string;
};

export type Product = {
    id: number;
    name: TranslatableField;
    brand?: ProductBrand;
    images?: ProductImage[];
    variants?: ProductVariant[];
    categories?: ProductCategory[];
    has_variants: boolean;
};

export type POSProps = {
    products: Product[];
    labels: OrderLabel[];
    currency: Currency;
    paymentMethods: PaymentMethod[];
};

export type CartItem = {
    id: string;
    product: Product;
    label?: OrderLabel;
    variant?: ProductVariant;
    quantity: number;
    unitPrice: number;
    discount: number;
};

export type ProductsProps = POSProps & {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

export type PaymentMethod = {
    id: number;
    name: TranslatableField;
    image?: string;
};

export type OrderLabel = {
    id: string;
    name: TranslatableField;
    price: number;
    image: string;
};

export type CartProps = {
    cart: CartItem[];
    setCart: (cart: CartItem[]) => void;
    currency: Currency;
    paymentMethods: PaymentMethod[];
    labels: OrderLabel[];
    currentLocale: string;
    storeOrder: (e: React.FormEvent) => void;
    setData?: <K extends keyof Order>(field: K, value: Order[K]) => void;
};

export type CheckoutProps = {
    cart: CartItem[];
    subtotal: number;
    couponDiscount: number;
    tax: number;
    total: number;
    currency: Currency;
    paymentMethod: number | null;
    setPaymentMethod: (methodId: number) => void;
    processPayment: () => void;
    paymentMethods: PaymentMethod[];
    currentLocale: string;
    onSubmit: (e: React.FormEvent) => void;
    setData?: <K extends keyof Order>(field: K, value: Order[K]) => void;
};

export interface Customer {
    id: string;
    name: string;
    surname: string;
    phone_no: string;
    points: number;
}

export type CustomerDialogProps = {
    setSelectedCustomer: Dispatch<SetStateAction<Customer | null>>;
};

export type CreateCustomerDialogProps = {
    onCustomerCreated?: (customer: Customer) => void;
};

export type CouponProps = {
    couponCode: string;
    setCouponCode: (value: string) => void;
    appliedCoupon: { code: string; discount: number } | null;
    applyCoupon: () => void;
};

export type TotalProps = {
    subtotal: number;
    couponDiscount: number;
    tax: number;
    total: number;
    labelTotal: number;
    currency: Currency;
    setData?: <K extends keyof Order>(field: K, value: Order[K]) => void;
};

export type LabelsProps = {
    labels: OrderLabel[];
    cartLabels: (OrderLabel & { quantity: number; id: string })[];
    setCartLabels: React.Dispatch<React.SetStateAction<(OrderLabel & { quantity: number; id: string })[]>>;
    updateLabelQuantity: (id: string, quantity: number) => void;
    removeLabelFromCart: (id: string) => void;
    currency: Currency;
    currentLocale: string;
};

export type CartProductsProps = {
    cart: CartItem[];
    currency: Currency;
    currentLocale: string;
    updateCartItem: (id: string, updates: Partial<CartItem>) => void;
    removeFromCart: (id: string) => void;
};

export type Order = {
    id: string;
    currency_id: string;
    order_status_id: string;
    customer_id: string;
    payment_method_id: number;
    origin: string;
    subtotal: number;
    label_value: number;
    discount_value: number;
    tax_value: number;
    total: number;
    products: Product[];
    labels: OrderLabel[];
};
