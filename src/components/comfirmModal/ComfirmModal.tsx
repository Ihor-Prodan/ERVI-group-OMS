import React from "react";
import "./ConfirmModal.css";
import Button from "../../UI-elements/button/Buttot";
import Loader from "../../UI-elements/loader/Loader";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Potvrdenie",
  message,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        {title && <h2 className="confirm-title">{title}</h2>}
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <Button text="Áno" variant="primary" onClick={onConfirm} disabled={isDeleting} />
          <Button text="Nie" variant="secondary" onClick={onCancel} disabled={isDeleting} />
        </div>
      </div>

       {isDeleting && <Loader fullscreen={true} />}
    </div>
  );
};

export default ConfirmModal;
