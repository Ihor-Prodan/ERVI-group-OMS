import React, { useState } from 'react';
import OrdersCalendar from './OrdersCalendar';
import './OrdersCalendar.css';
import { X } from 'lucide-react';
import type { OrderDetails } from '../types';

interface CalendarModalProps {
  ordersFromServer: OrderDetails[];
  refreshOrders: () => Promise<void>;
  onShowDetails: (id: string) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  onShowDetails,
  ordersFromServer,
  refreshOrders,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="order-calendar-open-btn">
        Otvoriť kalendár
      </button>

      {isOpen && (
        <div className="order-calendar-modal-overlay">
          <div className="order-calendar-modal-content">
            <button onClick={() => setIsOpen(false)} className="order-calendar-close-btn">
              <X size={34} />
            </button>

            <OrdersCalendar
              onShowDetails={onShowDetails}
              refreshOrders={refreshOrders}
              ordersFromServer={ordersFromServer}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarModal;
