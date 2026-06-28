import React from 'react';
import dayjs from 'dayjs';
import './SlotModal.css';

type Slot = { from: number; to: number };

interface SlotModalProps {
  date: Date;
  slots: Slot[];
  onSelect: (selectedDateTime: string, slot: Slot) => void;
  onClose: () => void;
}

export const SlotModal: React.FC<SlotModalProps> = ({ date, slots, onSelect, onClose }) => {
  return (
    <div className="slot-modal-overlay">
      <div className="slot-modal-container">
        {slots.length !== 0 && <h2 className="slot-modal-title">Vyberte časové pásmo</h2>}

        {slots.length === 0 ? (
          <p className="slot-modal-no-slots">
            Nie sú k dispozícii žiadne časové pásma. Vyberte iný deň.
          </p>
        ) : (
          <ul className="slot-modal-list">
            {slots.map((slot) => {
              const middleHour = slot.from + Math.floor((slot.to - slot.from) / 2);
              const slotDateTime = dayjs(date)
                .hour(middleHour)
                .minute(0)
                .second(0)
                .format('YYYY-MM-DDTHH:mm');

              return (
                <li key={`${slot.from}-${slot.to}`} className="slot-modal-item">
                  <button
                    className="slot-modal-button"
                    onClick={() => onSelect(slotDateTime, slot)}
                  >
                    {slot.from}:00 - {slot.to}:00
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <button className="slot-modal-close" onClick={onClose}>
          Zrušiť
        </button>
      </div>
    </div>
  );
};
