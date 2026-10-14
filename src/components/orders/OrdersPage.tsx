import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import OrdersList from './orderList/OrderList';
import OrderDetailsModal from './orderDetailsModal/OrderDetailsModal';
import { getOrders } from '../API/API';
import type { FilterOptions, OrderDetails } from './types';
import OrderFilters from './orderFilters/Filters';
import { filterOrders } from './orderFilters/orderFilters';
import CalendarModal from './ordersCalendar/CalendarModal';
import useAuth from '../../hooks/useAuth';
import './OrdersPage.css';

interface Props {
  type: 'new' | 'sent' | 'accepted' | 'cancelled' | 'delivered' | 'paid';
}

const OrdersPage: React.FC<Props> = ({ type }) => {
  const { isCompany } = useAuth();
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
    <div className="orders-page">
      <div className="orders-page-header">
        <h1 className="orders-page-title">
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
        </h1>
        <span className="orders-page-count">{filteredOrders.length}</span>
      </div>

      <OrderFilters
        orders={ordersFromServer}
        onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
        hideCountry={isCompany}
      />
      <div className="orders-toolbar">
        {!isCompany && (
          <CalendarModal
            onShowDetails={handleShowDetails}
            ordersFromServer={ordersFromServer}
            refreshOrders={fetchOrders}
          />
        )}
        <div className="filters-search-wrapper">
          <label className="filters-search-label">Hľadať</label>
          <div className="filters-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Meno, adresa, číslo DL..."
              value={filters.search || ''}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value || undefined }))
              }
            />
          </div>
        </div>
      </div>
      <OrdersList
        orders={filteredOrders}
        onShowDetails={handleShowDetails}
        refreshOrders={fetchOrders}
        readOnly={isCompany}
      />

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          readOnly={isCompany}
        />
      )}
    </div>
  );
};

export default OrdersPage;
