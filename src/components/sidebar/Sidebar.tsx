import React, { useState } from 'react';
import {
  PackagePlus,
  PackageCheck,
  Package,
  PackageX,
  LayoutList,
  CreditCard,
  FileText,
  Users
} from 'lucide-react';
import './Sidebar.css';
import Button from '../../UI-elements/button/Buttot';
import { changePassword } from '../API/API';
import useAuth from '../../hooks/useAuth';

interface SidebarProps {
  active: string;
  onChange: (val: string) => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ active, onChange, className }) => {
  const { isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


const allItems = [
  { id: 'accepted', label: 'Nové', icon: <PackagePlus size={18} />, adminOnly: true },
  { id: 'sent', label: 'Odoslané', icon: <PackageCheck size={18} />, adminOnly: true },
  { id: 'delivered', label: 'Doručené', icon: <Package size={18} />, adminOnly: true },
  { id: 'paid', label: 'Zaplatené', icon: <CreditCard size={18} />, adminOnly: true },
  { id: 'cancelled', label: 'Zrušené', icon: <PackageX size={18} />, adminOnly: true },
  { id: 'documents', label: 'Dokumenty', icon: <FileText size={18} />, adminOnly: false },
  { id: 'home', label: 'Formulár', icon: <LayoutList size={18} />, adminOnly: true },
  { id: 'users', label: 'Používatelia', icon: <Users size={18} />, adminOnly: true },
];

const items = allItems.filter(item => !item.adminOnly || isAdmin);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('Nové heslo a potvrdenie sa nezhodujú');

      return;
    }

    setLoading(true);
    setError(null);

    try {
      await changePassword(oldPassword, newPassword);
      alert('Heslo úspešne zmenené');
      
      setShowModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Chyba pri zmene hesla');
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordInput = (
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    setShow: (v: boolean) => void,
    placeholder: string
  ) => (
    <div className="password-wrapper">
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="toggle-eye" onClick={() => setShow(!show)}>
        {show ? '🙈' : '👁️'}
      </span>
    </div>
  );

  return (
    <aside className={`sidebar ${className || ''}`}>
      <div className="sidebar-content">
        <div className="sidebar-logo">Admin Panel</div>
        <nav className="sidebar-nav">
          {items.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${active === item.id ? 'active' : ''}`}
              onClick={() => onChange(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <Button text="Zmeniť heslo" variant="error" size="md" onClick={() => setShowModal(true)} />

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Zmena hesla</h3>

            {renderPasswordInput(oldPassword, setOldPassword, showOld, setShowOld, 'Staré heslo')}
            {renderPasswordInput(newPassword, setNewPassword, showNew, setShowNew, 'Nové heslo')}
            {renderPasswordInput(
              confirmPassword,
              setConfirmPassword,
              showConfirm,
              setShowConfirm,
              'Potvrdiť nové heslo'
            )}

            {error && <p className="error">{error}</p>}

            <div className="modal-actions">
              <Button text="Zrušiť" variant="secondary" onClick={() => setShowModal(false)} />
              <Button
                text={loading ? 'Čakajte...' : 'Zmeniť'}
                variant="primary"
                onClick={handlePasswordChange}
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
