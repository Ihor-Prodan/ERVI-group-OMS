import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import './OrderDetailsModal.css';
import { COMPANY_OPTIONS } from '../../fields/companies';
import { formatDate } from '../../../utils/dateUtils';
import { generateOrderDocument } from '../../API/API';
import type { OrderDetails } from '../types';
import { statusMap } from '../../../const/const';
import Loader from '../../../UI-elements/loader/Loader';

interface OrderDetailsModalProps {
  order: OrderDetails;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleDownloadDoc = async () => {
    setLoading(true);
    try {
      const blob = await generateOrderDocument(order.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `Objednavka_č.${order.deliveryNumber}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);

      alert('Chyba pri stahovaní dokumentu.');
    } finally {
      setLoading(false);
    }
  };

  const companyName =
    COMPANY_OPTIONS.find((c) => c.value === order.company)?.label || order.company;

  return (
    <div className="details-modal-overlay">
      <div className="details-modal">
        <button className="details-close" onClick={onClose}>
          <X size={20} />
        </button>
        <h2 className="details-title">Detaily objednávky</h2>

        <h3 className="details-section-title">Stav objednávky č. {order.deliveryNumber}</h3>
        <div className="details-grid">
          <div className="details-row">
            <div className="details-label">Status</div>
            <div className="details-value" style={{ color: statusMap[order.status].color }}>
              {statusMap[order.status].label}
            </div>
          </div>
          {order.statusDates.accepted && (
            <div className="details-row">
              <div className="details-label">Prijaté</div>
              <div className="details-value">{formatDate(order.statusDates.accepted)}</div>
            </div>
          )}
          {order.statusDates.sent && (
            <div className="details-row">
              <div className="details-label">Odoslané</div>
              <div className="details-value">{formatDate(order.statusDates.sent)}</div>
            </div>
          )}
          {order.statusDates.cancelled && (
            <div className="details-row">
              <div className="details-label">Zrušené</div>
              <div className="details-value">{formatDate(order.statusDates.cancelled)}</div>
            </div>
          )}
          {order.statusDates.delivered && (
            <div className="details-row">
              <div className="details-label">Doručené</div>
              <div className="details-value">{formatDate(order.statusDates.delivered)}</div>
            </div>
          )}
          {order.statusDates.paid && (
            <div className="details-row">
              <div className="details-label">Zaplatené</div>
              <div className="details-value">{formatDate(order.statusDates.paid)}</div>
            </div>
          )}
        </div>

        <h3 className="details-section-title">Odosielateľ</h3>
        <h4 className="details-section-subtitle">Adresa vyzdvihnutia zásielky</h4>
        <div className="details-grid">
          <div className="details-row">
            <div className="details-label">Spoločnosť</div>
            <div className="details-value">{companyName}</div>
          </div>
          <div className="details-row">
            <div className="details-label">Mesto</div>
            <div className="details-value">{order.city}</div>
          </div>
          <div className="details-row">
            <div className="details-label">Ulica a číslo domu</div>
            <div className="details-value">{order.street}</div>
          </div>
          <div className="details-row">
            <div className="details-label">PSČ</div>
            <div className="details-value">{order.psc}</div>
          </div>
          {order.country && (
            <div className="details-row">
              <div className="details-label">Krajina</div>
              <div className="details-value">{order.country}</div>
            </div>
          )}
          <div className="details-row">
            <div className="details-label">Telefón</div>
            <div className="details-value">{order.phone}</div>
          </div>
          <div className="details-row">
            <div className="details-label">Email</div>
            <div className="details-value">{order.email}</div>
          </div>
          <div className="details-row">
            <div className="details-label">Čislo DL</div>
            <div className="details-value">{order.contractNumber}</div>
          </div>
          <div className="details-row">
            <div className="details-label">Vybrané služby</div>
            <div className="details-value">
              {order.services.map((s, idx) => (
                <span key={idx} className="details-chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">GDPR súhlas</div>
            <div className="details-value">{order.gdpr ? 'Prijaté' : 'Nepotvrdené'}</div>
          </div>
          <div className="details-row">
            <div className="details-label">Produkty</div>
            <div className="details-value">
              {order.products.map((p, idx) => (
                <span key={idx} className="details-chip">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">Váha</div>
            <div className="details-value">{order.weight} kg</div>
          </div>
          <div className="details-row">
            <div className="details-label">Vyzdvihnutie</div>
            <div className="details-value">
              {order.pickupType === 'asap' ? (
                <>
                  <Clock size={16} /> Čo najskôr (urgentné)
                </>
              ) : order.pickupDate ? (
                formatDate(order.pickupDate)
              ) : (
                '-'
              )}
            </div>
          </div>
          <div className="details-row">
            <div className="details-label">Poznamka</div>
            <div className="details-value">
              {order.deliveryNote ? order.deliveryNote : 'Ziadna'}
            </div>
          </div>
        </div>

        <h3 className="details-section-title">Príjemca</h3>
        <h4 className="details-section-subtitle">Adresa na doručenie zásielky</h4>
        <div className="details-grid">
          <div className="details-row">
            <div className="details-label">Meno a priezvisko</div>
            <div className="details-value">{order.fullname}</div>
          </div>
          <div className="details-row">
            <div className="details-label">Ulica a číslo domu</div>
            <div className="details-value">{order.receiverStreet}</div>
          </div>
          <div className="details-row">
            <div className="details-label">Mesto doručenia</div>
            <div className="details-value">{order.receiverCity}</div>
          </div>
          <div className="details-row">
            <div className="details-label">PSČ</div>
            <div className="details-value">{order.receiverPsc}</div>
          </div>
          {order.receiverCountry && (
            <div className="details-row">
              <div className="details-label">Krajina</div>
              <div className="details-value">{order.receiverCountry}</div>
            </div>
          )}
          {order.receiverEmail && (
            <div className="details-row">
              <div className="details-label">Email príjemcu</div>
              <div className="details-value">{order.receiverEmail}</div>
            </div>
          )}
        </div>

        <div className="details-actions">
          {loading ? (
            <Loader fullscreen={true} />
          ) : (
            <button className="btn download" onClick={handleDownloadDoc}>
              Stiahnuť PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
