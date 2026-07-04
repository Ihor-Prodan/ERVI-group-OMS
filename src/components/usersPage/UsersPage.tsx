import React, { useEffect, useState } from 'react';
import { Trash2, UserPlus, Shield, BookOpen } from 'lucide-react';
import { getUsers, createUser, deleteUser } from '../API/API';
import ConfirmModal from '../comfirmModal/ComfirmModal';
import useAuth from '../../hooks/useAuth';
import './UsersPage.css';

interface UserEntry {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'accountant';
}

const EMPTY_FORM = { firstName: '', lastName: '', email: '', password: '', role: 'accountant' as 'admin' | 'accountant' };

const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getUsers()
      .then((res) => setUsers(res.users))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || form.password.length < 6) {
      setFormError('Zadajte email a heslo (min. 6 znakov).');
      return;
    }
    setIsSubmitting(true);
    setFormError('');
    try {
      const res = await createUser(form);
      setUsers((prev) => [...prev, res.user]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err: any) {
      setFormError(err.message || 'Chyba pri vytváraní používateľa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmId) return;
    setIsDeleting(true);
    try {
      await deleteUser(confirmId);
      setUsers((prev) => prev.filter((u) => u.id !== confirmId));
      setConfirmId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1 className="users-title">Používatelia</h1>
          <p className="users-subtitle">Správa prístupu do systému</p>
        </div>
        <button className="users-add-btn" onClick={() => setShowForm((v) => !v)}>
          <UserPlus size={16} />
          Pridať používateľa
        </button>
      </div>

      {showForm && (
        <form className="users-form" onSubmit={handleCreate}>
          <h3 className="users-form-title">Nový používateľ</h3>
          <div className="users-form-grid">
            <input
              className="users-input"
              placeholder="Meno"
              value={form.firstName}
              onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
            />
            <input
              className="users-input"
              placeholder="Priezvisko"
              value={form.lastName}
              onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
            />
            <input
              className="users-input"
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
            <input
              className="users-input"
              type="password"
              placeholder="Heslo (min. 6 znakov) *"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            />
          </div>
          <div className="users-role-group">
            <span className="users-role-label">Rola:</span>
            <button
              type="button"
              className={`users-role-btn ${form.role === 'accountant' ? 'is-active' : ''}`}
              onClick={() => setForm((p) => ({ ...p, role: 'accountant' }))}
            >
              <BookOpen size={14} /> Účtovník
            </button>
            <button
              type="button"
              className={`users-role-btn ${form.role === 'admin' ? 'is-active' : ''}`}
              onClick={() => setForm((p) => ({ ...p, role: 'admin' }))}
            >
              <Shield size={14} /> Admin
            </button>
          </div>
          {formError && <p className="users-form-error">{formError}</p>}
          <div className="users-form-actions">
            <button type="button" className="users-btn users-btn--cancel" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setFormError(''); }}>
              Zrušiť
            </button>
            <button type="submit" className="users-btn users-btn--submit" disabled={isSubmitting}>
              {isSubmitting ? 'Ukladá sa...' : 'Vytvoriť'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="users-loading">Načítava sa...</p>
      ) : (
        <div className="users-list">
          {users.map((u) => (
            <div key={u.id} className="users-card">
              <div className="users-card-avatar">
                {(u.firstName?.[0] || u.email[0]).toUpperCase()}
              </div>
              <div className="users-card-info">
                <span className="users-card-name">
                  {u.firstName || u.lastName ? `${u.firstName} ${u.lastName}`.trim() : '—'}
                </span>
                <span className="users-card-email">{u.email}</span>
              </div>
              <span className={`users-badge users-badge--${u.role}`}>
                {u.role === 'admin' ? <><Shield size={11} /> Admin</> : <><BookOpen size={11} /> Účtovník</>}
              </span>
              <button
                className="users-delete-btn"
                onClick={() => setConfirmId(u.id)}
                disabled={u.id === currentUser?.id}
                title={u.id === currentUser?.id ? 'Nemôžete zmazať vlastný účet' : 'Zmazať používateľa'}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        isOpen={!!confirmId}
        title="Zmazať používateľa"
        message="Naozaj chcete zmazať tohto používateľa? Táto akcia je nevratná."
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmId(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default UsersPage;
