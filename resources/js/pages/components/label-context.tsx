import { createContext, useContext } from 'react';
import { OrderLabel } from '../data';

const OrderLabelContext = createContext([]);

export const OrderLabelProvider = ({ children, labels }: { children: React.ReactNode; labels: OrderLabel[] }) => {
    return <OrderLabelContext.Provider value={labels}>{children}</OrderLabelContext.Provider>;
};

export const useOrderLabel = () => useContext(OrderLabelContext);
