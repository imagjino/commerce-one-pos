'use client';

import CustomInput from '@/components/input/custom-input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Check, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import { CreateCustomerDialogProps, Customer } from '../data';

export function CreateCustomerDialog({ onCustomerCreated }: CreateCustomerDialogProps) {
    const { t } = useTranslation('POS');
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, reset, clearErrors, errors } = useForm({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '12345678',
        points: 0,
    });

    const storeCustomer: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('customers.store'), {
            preserveScroll: true,
            onSuccess: (page) => {
                const props = page.props as { newCustomer?: Customer };
                const customer: Customer =
                    props.newCustomer ??
                    ({
                        ...data,
                        id: '',
                        phone_no: '',
                    } as Customer);

                if (customer && onCustomerCreated) {
                    onCustomerCreated(customer);
                }

                toast(t('customer_added_successfully'), { position: 'top-right', duration: 2000 });
                closeModal();
            },
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} modal={true}>
            <DialogTrigger asChild>
                <Button size="sm" className="w-full" onClick={() => setOpen(true)}>
                    {t('add_customer')}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>{t('add_customer')}</DialogTitle>

                <form className="space-y-6" onSubmit={storeCustomer}>
                    <div className="grid grid-cols-1 gap-2">
                        <CustomInput id="name" placeholder={t('name')} setFormData={setData} errorMessage={errors.name} />
                        <CustomInput id="surname" placeholder={t('surname')} setFormData={setData} errorMessage={errors.surname} />
                        <CustomInput id="username" placeholder={t('username')} setFormData={setData} errorMessage={errors.username} />
                        <CustomInput type="email" id="email" placeholder={t('email')} setFormData={setData} errorMessage={errors.email} />
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={closeModal}>
                                {t('close')}
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled={processing}>
                            {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                            {t('add_customer')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
