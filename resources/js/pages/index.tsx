import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { POSProps } from './data';
import { posBreadcrumbs } from './data';
import { Form } from './form';

export default function POS({ products, currency, paymentMethods }: POSProps) {
    return (
        <AppLayout breadcrumbs={posBreadcrumbs}>
            <Head title="POS" />
            <div className="flex flex-col gap-2 p-4">
                <Form products={products} currency={currency} paymentMethods={paymentMethods} />
            </div>
        </AppLayout>
    );
}
