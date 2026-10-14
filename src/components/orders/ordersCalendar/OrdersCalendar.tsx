import React, { useEffect, useState } from 'react';
import type { OrderDetails } from '../types';
import OrderCard from '../orderCard/OrderCard';
import './OrdersCalendar.css';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, X, FileDown } from 'lucide-react';
import { WEEK_DAYS } from './const';
import { getDayColor, isWeekend } from './utils';
import { statusMap } from '../../../const/const';
import useAuth from '../../../hooks/useAuth';
import { generateDayOrdersDocument } from '../../API/API';

interface OrdersCalendarProps {
  refreshOrders: () => Promise<void>;
  ordersFromServer: OrderDetails[];
  onShowDetails: (id: string) => void;
}

const OrdersCalendar: React.FC<OrdersCalendarProps> = ({
  onShowDetails,
  refreshOrders,
  ordersFromServer,
}) => {
  const { isCompany } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [generatingDoc, setGeneratingDoc] = useState(false);

  const handleGenerateDayDoc = async (dateKey: string, dayOrders: OrderDetails[]) => {
    setGeneratingDoc(true);
    try {
      const blob = await generateDayOrdersDocument(
        dayOrders.map((o) => o.id),
        dateKey
      );
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Objednavky_${dateKey}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Chyba pri generovaní dokumentu.');
    } finally {
      setGeneratingDoc(false);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const sentOrders = ordersFromServer.filter(
    (o) => o.status === 'sent' || o.status === 'delivered' || o.status === 'paid'
  );
  const ordersByDate: Record<string, OrderDetails[]> = {};

  sentOrders.forEach((o) => {
    if (!o.statusDates?.sent) return;

    const dateKey = format(new Date(o.statusDates.sent), 'yyyy-MM-dd');

    if (!ordersByDate[dateKey]) ordersByDate[dateKey] = [];
    ordersByDate[dateKey].push(o);
  });

  const reservations = ordersFromServer.filter((o) => o.source === 'reservation');
  const reservationDates = new Set<string>();

  reservations.forEach((o) => {
    if (!o.statusDates?.accepted) return;

    const dateKey = format(new Date(o.statusDates.accepted), 'yyyy-MM-dd');

    reservationDates.add(dateKey);
    if (!ordersByDate[dateKey]) ordersByDate[dateKey] = [];
    if (!ordersByDate[dateKey].some((existing) => existing.id === o.id)) {
      ordersByDate[dateKey].push(o);
    }
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  return (
    <div className="order-calendar">
      <div className="order-calendar-header">
        <button className="nav-btn" onClick={handlePrevMonth}>
          <ChevronLeft size={22} />
        </button>
        <h2>{currentMonth.toLocaleString('sk-SK', { month: 'long', year: 'numeric' })}</h2>
        <button className="nav-btn" onClick={handleNextMonth}>
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="order-calendar-weekdays">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="order-calendar-grid">
        {Array.from({ length: (firstDayOfMonth + 6) % 7 }).map((_, i) => (
          <div key={'empty' + i} className="order-calendar-day empty"></div>
        ))}

        {daysArray.map((day) => {
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
          const dateKey = format(new Date(year, month, day), 'yyyy-MM-dd'); // local
          const count = ordersByDate[dateKey]?.filter((o) => o.status === 'sent').length || 0;
          const deliveredCount =
            ordersByDate[dateKey]?.filter((o) => o.status === 'delivered').length || 0;
          const paidCount = ordersByDate[dateKey]?.filter((o) => o.status === 'paid').length || 0;
          const hasReservation = reservationDates.has(dateKey);

          return (
            <div
              key={day}
              data-day={day}
              onClick={() => setSelectedDate(dateKey)}
              className={`order-calendar-day
                ${selectedDate === dateKey ? 'selected' : ''}
                ${isWeekend(year, month, day) ? 'weekend' : ''}
                ${isToday ? 'today' : ''}`}
              style={{ backgroundColor: getDayColor(count, deliveredCount, isToday) }}
            >
              <span>{day}</span>
              {hasReservation && (
                <span className="order-calendar-reservation-dot" title="Rezervácia" />
              )}
              <div className="order-calendar-badges">
                {count > 0 && <div className="order-calendar-badge badge-sent">{count}</div>}
                {deliveredCount > 0 && (
                  <div className="order-calendar-badge badge-delivered">{deliveredCount}</div>
                )}
                {paidCount > 0 && <div className="order-calendar-badge badge-paid">{paidCount}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && ordersByDate[selectedDate]?.length > 0 && (
        <div className="order-calendar-orders-list">
          <div className="order-calendar-orders-list-header">
            <h3>Objednávky pre {selectedDate}</h3>
            <button
              type="button"
              className="order-calendar-gen-doc-btn"
              disabled={generatingDoc}
              onClick={() => handleGenerateDayDoc(selectedDate, ordersByDate[selectedDate])}
            >
              <FileDown size={15} />
              {generatingDoc ? 'Generuje sa...' : 'Generovať dokument'}
            </button>
          </div>
          <ul>
            {[...ordersByDate[selectedDate]]
              .sort((a, b) => {
                const aTime = new Date(a.statusDates.sent || a.statusDates.accepted || 0).getTime();
                const bTime = new Date(b.statusDates.sent || b.statusDates.accepted || 0).getTime();
                return aTime - bTime;
              })
              .map((o) => (
              <li
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className="order-calendar-order-item"
              >
                <span className="order-calendar-order-time">
                  {o.source === 'reservation' && <span className="order-calendar-reservation-tag">Rezervácia</span>}
                  #{o.deliveryNumber} - {o.company} → {o.to || o.receiverStreet} (
                  {format(new Date(o.statusDates.sent || o.statusDates.accepted || 0), 'HH:mm')})
                </span>

                <span
                  className="order-card-status"
                  style={{
                    backgroundColor: statusMap[o.status].color,
                    color: statusMap[o.status].color === '#aef840ff' ? 'black' : 'white',
                  }}
                >
                  {statusMap[o.status].label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedOrder && (
        <div className="order-calendar-modal-overlay">
          <div className="order-calendar-modal-content">
            <button className="order-calendar-close-btn" onClick={() => setSelectedOrder(null)}>
              <X size={28} />
            </button>
            <OrderCard
              order={selectedOrder}
              refreshOrders={refreshOrders}
              onShowDetails={onShowDetails}
              setSelectedOrder={setSelectedOrder}
              readOnly={isCompany}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersCalendar;
