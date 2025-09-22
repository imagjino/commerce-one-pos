import type { BreadcrumbItem } from '@/types';
import { TranslatableField } from '@/types/helpers';
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

export type ProductVariant = {
    id: number;
    product_id: number;
    quantity: number;
    variant_price?: VariantPrice[];
};

export type ProductBrand = {
    id: number;
    brand_name: string;
};

export type Product = {
    id: number;
    name: TranslatableField;
    brand?: ProductBrand;
    images?: ProductImage[];
    variants?: ProductVariant[];
    has_variants: boolean;
};

export type PaginatedProducts = {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export interface POSProps {
    products: PaginatedProducts;
}
