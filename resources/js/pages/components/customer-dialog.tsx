'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Customer, CustomerDialogProps } from '../data';

export function CustomerDialog({ setSelectedCustomer }: CustomerDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchTerm.length < 3) {
            setCustomers([]);
            return;
        }

        const controller = new AbortController();
        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/customer/search?search=${encodeURIComponent(searchTerm)}`, {
                    signal: controller.signal,
                });
                const data = await response.json();
                setCustomers(data.data.data || []);
            } catch (err) {
                if (err.name !== 'AbortError') console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();

        return () => controller.abort();
    }, [searchTerm]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                    <Input placeholder="Search customers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                    <div className="max-h-60 space-y-2 overflow-y-auto">
                        {loading && <div className="text-muted-foreground py-2 text-center text-sm">Loading...</div>}

                        {!loading && customers.length === 0 && searchTerm.length >= 3 && (
                            <div className="text-muted-foreground py-2 text-center text-sm">No customers found.</div>
                        )}

                        {customers.map((customer: Customer) => (
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
                                <div className="text-primary text-sm">{customer.points} points</div>
                            </div>
                        ))}
                    </div>

                    <Button className="w-full bg-transparent" variant="outline">
                        Add New Customer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
