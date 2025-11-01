import React, { useState } from 'react';
import { X } from 'lucide-react';
import './ChangeDateModal.css';
import CustomInput from '../../../UI-elements/input/Input';
import Button from '../../../UI-elements/button/Buttot';
import ConfirmModal from '../../comfirmModal/ComfirmModal';
import dayjs from 'dayjs';

interface ChangeDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
}

const ChangeDateModal: React.FC<ChangeDateModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [dateTime, setDateTime] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!dateTime) {
      setErrorMessage('Vyberte dátum a čas odoslania.');

      return;
    }
    const isoDate = new Date(dateTime).toISOString();

    onConfirm(isoDate);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <h2 className="modal-title">Vyberte dátum odoslania</h2>
        <CustomInput
          label="Dátum odoslania"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          min={dayjs().format('YYYY-MM-DDTHH:mm')}
        />
        <Button text="Potvrdiť" onClick={handleConfirm} className="modal-btn" />
      </div>

      {errorMessage && (
        <ConfirmModal
          isOpen={!!errorMessage}
          title="Upozornenie"
          message={errorMessage}
          onConfirm={() => setErrorMessage(null)}
          onCancel={() => setErrorMessage(null)}
        />
      )}
    </div>
  );
};

export default ChangeDateModal;
