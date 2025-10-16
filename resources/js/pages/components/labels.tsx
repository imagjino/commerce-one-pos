'use client';

import { CustomCombobox } from '@/components/input/custom-combobox';
import { Button } from '@/components/ui/button';
import { CommandItem } from '@/components/ui/command';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LabelsProps, OrderLabel } from '../data';

export function Labels({ labels, cartLabels, setCartLabels, updateLabelQuantity, removeLabelFromCart, currency, currentLocale }: LabelsProps) {
    const { t } = useTranslation('POS');

    const addLabelToCart = (label: OrderLabel) => {
        const existing = cartLabels.find((l) => l.id === `label-${label.id}`);
        if (existing) {
            updateLabelQuantity(existing.id, existing.quantity + 1);
        } else {
            setCartLabels([...cartLabels, { ...label, quantity: 1, id: label.id.toString() }]);
        }
    };

    return (
        <>
            <CustomCombobox placeholder={t('label')} text={t('select_label')} className="col-span-3 w-full">
                <>
                    {labels.map((label) => (
                        <CommandItem key={label.id} value={label.id.toString()} className="w-full" onSelect={() => addLabelToCart(label)}>
                            {label.name[currentLocale]}
                        </CommandItem>
                    ))}
                </>
            </CustomCombobox>

            {/* Render Labels in Cart */}
            {cartLabels.length > 0 && (
                <div className="mt-2 max-h-60 space-y-3 overflow-y-auto">
                    {cartLabels.map((label) => (
                        <div key={label.id} className="flex items-center gap-3 rounded-lg border p-3">
                            <img src={label.image} alt={label.name[currentLocale]} className="h-12 w-12 rounded object-cover" />
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium">{label.name[currentLocale]}</div>
                                <div className="text-muted-foreground text-sm">
                                    {currency.symbol} {label.price.toFixed(2)} × {label.quantity}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost" onClick={() => updateLabelQuantity(label.id, label.quantity - 1)}>
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm">{label.quantity}</span>
                                <Button size="sm" variant="ghost" onClick={() => updateLabelQuantity(label.id, label.quantity + 1)}>
                                    <Plus className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => removeLabelFromCart(label.id)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
