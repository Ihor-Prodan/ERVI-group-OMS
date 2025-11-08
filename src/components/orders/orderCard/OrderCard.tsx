import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Building2,
  Eye,
  ArrowRight,
  XCircle,
  Clock,
  PackageCheck,
  FileText,
  Package,
} from 'lucide-react';
import './OrderCard.css';
import ChangeDateModal from '../changeModal/ChangeDateModal';
import { COMPANY_OPTIONS } from '../../fields/companies';
import { changeOrderStatus, deleteOrder } from '../../API/API';
import ConfirmModal from '../../comfirmModal/ComfirmModal';
import { formatDate } from '../../../utils/dateUtils';
import Loader from '../../../UI-elements/loader/Loader';
import type { OrderDetails, OrderStatus } from '../types';
import { statusMap } from '../../../const/const';
import { buttomName } from './const';

interface OrderCardProps {
  order: OrderDetails;
  onShowDetails: (id: string) => void;
  refreshOrders: () => Promise<void>;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onShowDetails, refreshOrders }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmData, setConfirmData] = useState<{
    message: string;
    action: () => Promise<void>;
  } | null>(null);

  const companyName =
    COMPANY_OPTIONS.find((c) => c.value === order.company)?.label || order.company;

  const renderPickupInfo = () => {
    switch (order.status) {
      case 'accepted':
        return order.pickupType === 'asap' ? (
          <p className="urgent">
            <Clock size={16} /> <strong>Čo najskôr</strong>
          </p>
        ) : (
          order.pickupDate && (
            <p>
              <Calendar size={16} /> Odvoz: {formatDate(order.pickupDate)}
            </p>
          )
        );
      case 'sent':
        return (
          order.statusDates.sent && (
            <p>
              <Calendar size={16} /> Odvoz: {formatDate(order.statusDates.sent)}
            </p>
          )
        );
      case 'paid':
        return (
          order.statusDates.paid && (
            <p>
              <PackageCheck size={16} /> Zaplatené: {formatDate(order.statusDates.paid)}
            </p>
          )
        );
      case 'delivered':
        return (
          order.statusDates.delivered && (
            <p>
              <Package size={16} /> Doručené: {formatDate(order.statusDates.delivered)}
            </p>
          )
        );
      case 'cancelled':
        return (
          order.statusDates.cancelled && (
            <p className="urgent">
              <XCircle size={16} /> Zrušené: {formatDate(order.statusDates.cancelled)}
            </p>
          )
        );
      default:
        return null;
    }
  };

  const handleNextStatusClick = async () => {
    if (loading) {
      return;
    }

    let nextStatus: OrderStatus | null = null;
    const now = new Date().toISOString();

    switch (order.status) {
      case 'accepted':
        setModalOpen(true);
        return;
      case 'sent':
        nextStatus = 'delivered';
        break;
      case 'delivered':
        nextStatus = 'paid';
        break;
      default:
        nextStatus = null;
    }

    if (!nextStatus) {
      return;
    }

    if (nextStatus === 'delivered' || nextStatus === 'paid') {
      setConfirmData({
        message:
          nextStatus === 'delivered'
            ? 'Naozaj chcete označiť objednávku ako doručenú?'
            : 'Naozaj chcete označiť objednávku ako zaplatenú?',
        action: async () => {
          setLoading(true);
          try {
            await changeOrderStatus(order.id, nextStatus, now);
            await refreshOrders();
          } catch (err) {
            console.error(err);
            alert('Nepodarilo sa zmeniť stav objednávky');
          } finally {
            setLoading(false);
          }
        },
      });
    } else {
      setLoading(true);
      try {
        await changeOrderStatus(order.id, nextStatus, now);
        await refreshOrders();
      } catch (err) {
        console.error(err);
        alert('Nepodarilo sa zmeniť stav objednávky');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelClick = () => {
    if (order.status === 'paid') {
      setConfirmData({
        message: 'Objednávku, ktorá je už zaplatená, nie je možné zrušiť.',
        action: async () => {},
      });

      return;
    }

    setConfirmData({
      message: 'Naozaj chcete zrušiť túto objednávku?',
      action: async () => {
        setLoading(true);
        try {
          const now = new Date().toISOString();

          await changeOrderStatus(order.id, 'cancelled', now);
          await refreshOrders();
        } catch (err) {
          console.error(err);

          setConfirmData({
            message: 'Nepodarilo sa zrušiť objednávku',
            action: async () => {},
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleConfirmDate = async (date: string) => {
    if (loading) return;

    setLoading(true);
    try {
      const isoDate = new Date(date).toISOString();

      await changeOrderStatus(order.id, 'sent', isoDate);

      setModalOpen(false);
      refreshOrders();
    } catch (err) {
      console.error(err);
      alert('Nepodarilo sa nastaviť dátum odvozu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setConfirmData({
      message: 'Naozaj chcete vymazať túto objednávku?',
      action: async () => {
        try {
          await deleteOrder(order.id);
          await refreshOrders();

          setConfirmData({
            message: 'Objednávka bola úspešne vymazaná',
            action: async () => {},
          });
        } catch (err: any) {
          console.error(err);

          setConfirmData({
            message: err.message || 'Chyba pri vymazávaní objednávky',
            action: async () => {},
          });
        }
      },
    });
  };

  const handleChangeDate = async (status: string) => {
    if (status !== 'sent') {
      return;
    }

    try {
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      alert('Nepodarilo sa zmeniť dátum odvozu');
    }
  };

  return (
    <>
      {loading ? (
        <div className="order-card order-card--loading">
          <Loader size={40} text="Spracovávam..." />
        </div>
      ) : (
        <div className="order-card">
          <div className="order-card-header">
            <span className="order-card-company">
              <Building2 size={18} /> {companyName}
            </span>

            <span
              className="order-card-status"
              style={{
                backgroundColor: statusMap[order.status].color,
                color: statusMap[order.status].color === '#aef840ff' ? 'black' : 'white',
              }}
            >
              {statusMap[order.status].label}
            </span>
          </div>

          <div className="order-card-body">
            <p>
              <FileText size={16} /> Číslo objednávky: #{order.deliveryNumber}
            </p>
            <p>
              <Calendar size={16} /> Vytvorené: {formatDate(order.statusDates.accepted)}
            </p>

            {renderPickupInfo()}

            <p>
              <MapPin size={16} color="green" className="icon" /> Od: {order.from}
            </p>
            <p>
              <MapPin size={16} color="red" className="icon" /> Do: {order.to}
            </p>
          </div>

          <div className="order-card-actions">
            <button className="btn details" onClick={() => onShowDetails(order.id)}>
              <Eye size={16} /> Detaily
            </button>

            {order.status === 'sent' && (
              <button
                className="btn next"
                style={{ backgroundColor: statusMap[order.status].color, color: 'white' }}
                onClick={() => handleChangeDate(order.status)}
              >
                Zmenit odoslanie
              </button>
            )}

            {order.status !== 'cancelled' && order.status !== 'paid' && (
              <button
                className="btn next"
                onClick={handleNextStatusClick}
                style={{
                  backgroundColor: (() => {
                    switch (order.status) {
                      case 'accepted':
                        return statusMap['sent'].color;
                      case 'sent':
                        return statusMap['delivered'].color;
                      case 'delivered':
                        return statusMap['paid'].color;
                      default:
                        return '#ccc';
                    }
                  })(),
                  color: '#fff',
                }}
              >
                <ArrowRight size={16} /> {buttomName[order.status]}
              </button>
            )}

            {order.status !== 'cancelled' &&
              order.status !== 'paid' &&
              order.status !== 'delivered' && (
                <button className="btn cancel" onClick={handleCancelClick}>
                  <XCircle size={16} /> Zrušiť
                </button>
              )}

            {(order.status === 'cancelled' ||
              order.status === 'paid' ||
              order.status === 'delivered') && (
              <button className="btn cancel" onClick={handleDelete}>
                <XCircle size={16} /> Vymazať objednávku
              </button>
            )}
          </div>
        </div>
      )}

      <ChangeDateModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDate}
      />

      {confirmData && (
        <ConfirmModal
          isOpen={!!confirmData}
          title="Potvrdenie"
          message={confirmData.message}
          onConfirm={async () => {
            await confirmData.action();
            setConfirmData(null);
          }}
          onCancel={() => setConfirmData(null)}
        />
      )}
    </>
  );
};

export default OrderCard;
