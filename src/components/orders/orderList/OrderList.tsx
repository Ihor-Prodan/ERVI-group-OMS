import React from 'react';
import './OrdersList.css';
import OrderCard from '../orderCard/OrderCard';
import type { OrderDetails } from '../types';

interface OrdersListProps {
  orders: OrderDetails[];
  onShowDetails: (id: string) => void;
  refreshOrders: () => Promise<void>;
  readOnly?: boolean;
}

const OrdersList: React.FC<OrdersListProps> = ({ orders, onShowDetails, refreshOrders, readOnly }) => {
  return (
    <div className="orders-list">
      {orders.length === 0 && (
        <div className="no-orders">
          <p>Žiadne objednávky neboli nájdené.</p>
        </div>
      )}

      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onShowDetails={onShowDetails}
          refreshOrders={refreshOrders}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
};

export default OrdersList;
