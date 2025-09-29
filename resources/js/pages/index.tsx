import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { OrderLabelProvider } from './components/label-context';
import type { POSProps } from './data';
import { posBreadcrumbs } from './data';
import { Form } from './form';

export default function POS({ products, currency, paymentMethods, labels }: POSProps) {
    return (
        <OrderLabelProvider labels={labels}>
            <AppLayout breadcrumbs={posBreadcrumbs}>
                <Head title="POS" />
                <div className="flex flex-col gap-2 p-4">
                    <Form products={products} currency={currency} paymentMethods={paymentMethods} labels={labels} />
                </div>
            </AppLayout>
        </OrderLabelProvider>
    );
}
