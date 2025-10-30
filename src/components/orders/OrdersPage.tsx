import React, { useEffect, useState } from 'react';
import OrdersList from './orderList/OrderList';
import OrderDetailsModal from './orderDetailsModal/OrderDetailsModal';
import { getOrders } from '../API/API';
import type { FilterOptions, OrderDetails } from './types';
import OrderFilters from './orderFilters/Filters';
import { filterOrders } from './orderFilters/orderFilters';

const OrdersPage: React.FC<{ type: 'new' | 'old' }> = ({ type }) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [ordersFromServer, setOrdersFromServer] = useState<OrderDetails[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});

  const fetchOrders = async () => {
    try {
      const respons = await getOrders();

      if (respons) {
        setOrdersFromServer(respons);
      } else {
        setOrdersFromServer([]);
      }

      console.log('Fetched orders:', respons);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = filterOrders(
    ordersFromServer.filter((o) => {
      const { accepted, sent, cancelled, paid } = o.statusDates;

      if (type === 'new') {
        return accepted && !sent && !cancelled && !paid;
      } else {
        return !!(sent || cancelled || paid);
      }
    }),
    filters
  );

  const handleShowDetails = (id: string) => {
    const found = filteredOrders.find((o) => o.id === id);
    if (found) setSelectedOrder(found);
  };

  return (
    <div>
      <h2>{type === 'new' ? 'Nové objednávky' : 'Staré objednávky'}</h2>
      <OrderFilters orders={ordersFromServer} onFilterChange={(filters) => setFilters(filters)} />
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
