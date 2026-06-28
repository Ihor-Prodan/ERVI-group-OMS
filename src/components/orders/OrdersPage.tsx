import React, { useEffect, useState } from 'react';
import OrdersList from './orderList/OrderList';
import OrderDetailsModal from './orderDetailsModal/OrderDetailsModal';
import { getOrders } from '../API/API';
import type { FilterOptions, OrderDetails } from './types';
import OrderFilters from './orderFilters/Filters';
import { filterOrders } from './orderFilters/orderFilters';
import CalendarModal from './ordersCalendar/CalendarModal';

interface Props {
  type: 'new' | 'sent' | 'accepted' | 'cancelled' | 'delivered' | 'paid';
}

const OrdersPage: React.FC<Props> = ({ type }) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [ordersFromServer, setOrdersFromServer] = useState<OrderDetails[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrdersFromServer(response || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusFiltered = ordersFromServer.filter((o) => {
    const s = o.statusDates || {};

    switch (type) {
      case 'sent':
        return !!s.sent && !s.delivered && !s.cancelled;
      case 'accepted':
        return !!s.accepted && !s.sent && !s.delivered && !s.cancelled;
      case 'delivered':
        return !!s.delivered && !s.paid;
      case 'paid':
        return !!s.paid;
      case 'cancelled':
        return !!s.cancelled;
      default:
        return false;
    }
  });

  const filteredOrders = filterOrders(statusFiltered, filters);

  const handleShowDetails = (id: string) => {
    const found = ordersFromServer.find((o) => o.id === id);
    if (found) setSelectedOrder(found);
  };

  return (
    <div>
      <h2>
        {
          {
            new: 'Nové objednávky',
            sent: 'Odoslané objednávky',
            accepted: 'Akceptované objednávky',
            delivered: 'Doručené objednávky',
            cancelled: 'Zrušené objednávky',
            paid: 'Zaplatené objednávky',
          }[type]
        }
      </h2>

      <OrderFilters orders={ordersFromServer} onFilterChange={(filters) => setFilters(filters)} />
      <CalendarModal
        onShowDetails={handleShowDetails}
        ordersFromServer={ordersFromServer}
        refreshOrders={fetchOrders}
      />
      <OrdersList
        orders={filteredOrders}
        onShowDetails={handleShowDetails}
        refreshOrders={fetchOrders}
      />

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default OrdersPage;
