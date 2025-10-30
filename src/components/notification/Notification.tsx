import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './Notification.css';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose?: () => void;
};

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  return (
    <div className={`notification ${type}`}>
      <div className="notification-icon">
        {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </div>
      <div className="notification-message">{message}</div>
      {onClose && (
        <button className="notification-close" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};

export default Notification;
