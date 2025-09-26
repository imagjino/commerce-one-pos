'use client';

import CustomInput from '@/components/input/custom-input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Customer, CustomerDialogProps } from '../data';
import { CreateCustomerDialog } from './create-customer-dialog';
import { route } from 'ziggy-js';

export function CustomerDialog({ setSelectedCustomer }: CustomerDialogProps) {
    const { t } = useTranslation('POS');
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchTerm.length < 3) {
            setCustomers([]);
            return;
        }

        setLoading(true);

        fetch(route('customers.search', { search: searchTerm }))
            .then((res) => res.json())
            .then((data) => setCustomers(data.data.data || []))
            .finally(() => setLoading(false));
    }, [searchTerm]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" onClick={() => setIsOpen(true)}>
                    <User className="sm" />
                    {t('customers')}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('select_customer')}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <CustomInput
                        id="customerSearch"
                        placeholder={t('search_customers')}
                        value={searchTerm}
                        errorMessage={undefined}
                        setFormData={(_, value) => setSearchTerm(value as string)}
                        hideLabel={true}
                    />

                    <div className="max-h-60 space-y-2 overflow-y-auto">
                        {loading && <div className="text-muted-foreground py-2 text-center text-sm">{t('loading')}</div>}

                        {!loading && searchTerm.length < 3 && (
                            <div className="text-muted-foreground py-2 text-center text-lg font-medium">{t('enter_3_characters')}</div>
                        )}

                        {!loading && customers.length === 0 && searchTerm.length >= 3 && (
                            <div className="text-muted-foreground py-2 text-center text-lg font-medium">{t('no_customer_found')}</div>
                        )}

                        {searchTerm.length >= 3 &&
                            customers.map((customer: Customer) => (
                                <div
                                    key={customer.id}
                                    className="hover:bg-muted cursor-pointer rounded-lg border p-3"
                                    onClick={() => {
                                        setSelectedCustomer(customer);
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="font-medium">
                                        {customer.name} {customer.surname}
                                    </div>
                                    <div className="text-muted-foreground text-sm">{customer.phone_no}</div>
                                    <div className="text-primary text-sm">
                                        {customer.points} {t('points')}
                                    </div>
                                </div>
                            ))}
                    </div>

                    <CreateCustomerDialog
                        onCustomerCreated={(customer) => {
                            setSelectedCustomer(customer);
                            setIsOpen(false);
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
