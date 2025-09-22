import type { BreadcrumbItem } from '@/types';
import { TranslatableField } from '@/types/helpers';
import { Dispatch, SetStateAction } from 'react';
import { route } from 'ziggy-js';
import { CustomerDialog } from './components/customer-dialog';

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

export type PaginatedProducts = {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export type POSProps = {
    products: PaginatedProducts;
    currency: Currency;
    paymentMethods: PaymentMethod[];
};

export type CartItem = {
    id: string;
    product: Product;
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

export type CartProps = {
    cart: CartItem[];
    setCart: (cart: CartItem[]) => void;
    currency: Currency;
    paymentMethods: PaymentMethod[];
    currentLocale: string;
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
};

export interface Customer {
    id: string;
    name: string;
    surname: string;
    phone_no: string;
    points: string;
}

export type CustomerDialogProps = {
    setSelectedCustomer: Dispatch<SetStateAction<CustomerDialog | null>>;
};
