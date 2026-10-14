import React, { useState } from 'react';
import { X, CalendarPlus } from 'lucide-react';
import { createOrder } from '../../API/API';
import './ReservationModal.css';

interface ReservationModalProps {
  onClose: () => void;
  onCreated: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ onClose, onCreated }) => {
  const [fullname, setFullname] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullname.trim() || !phone.trim()) {
      setError('Zadajte meno a telefón.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await createOrder({
        source: 'reservation',
        fullname: fullname.trim(),
        address: address.trim(),
        receiverEmail: email.trim(),
        receiverPhone: phone.trim(),
        message: message.trim(),
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Rezerváciu sa nepodarilo vytvoriť.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reservation-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="reservation-modal">
        <button
          type="button"
          className="reservation-modal-close"
          onClick={onClose}
          aria-label="Zavrieť"
        >
          <X size={18} />
        </button>

        <div className="reservation-modal-icon">
          <CalendarPlus size={22} />
        </div>

        <h3>Nová rezervácia</h3>

        <form onSubmit={handleSubmit} className="reservation-modal-form">
          <label className="reservation-field">
            <span className="reservation-field-label">Meno a priezvisko *</span>
            <input value={fullname} onChange={(e) => setFullname(e.target.value)} />
          </label>

          <label className="reservation-field">
            <span className="reservation-field-label">Adresa</span>
            <input value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>

          <div className="reservation-field-row">
            <label className="reservation-field">
              <span className="reservation-field-label">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>

            <label className="reservation-field">
              <span className="reservation-field-label">Telefón *</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
          </div>

          <label className="reservation-field">
            <span className="reservation-field-label">Poznámka</span>
            <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>

          {error && <p className="reservation-modal-error">{error}</p>}

          <div className="reservation-modal-actions">
            <button type="button" className="reservation-btn reservation-btn--cancel" onClick={onClose}>
              Zrušiť
            </button>
            <button type="submit" className="reservation-btn reservation-btn--submit" disabled={isSubmitting}>
              {isSubmitting ? 'Ukladá sa...' : 'Vytvoriť rezerváciu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
