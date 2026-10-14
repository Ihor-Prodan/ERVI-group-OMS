import React, { useEffect, useState } from 'react';
import { Trash2, UserPlus, Shield, BookOpen, Building2, KeyRound, Copy, X } from 'lucide-react';
import {
  getUsers,
  createUser,
  deleteUser,
  resetUserPassword,
  getCompanies,
  createCompany,
  type Company,
} from '../API/API';
import ConfirmModal from '../comfirmModal/ComfirmModal';
import CustomDropdown from '../../UI-elements/dropdown/Dropdown';
import useAuth from '../../hooks/useAuth';
import { COUNTRY_OPTIONS } from '../fields/companies';
import './UsersPage.css';

interface UserEntry {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'accountant' | 'company';
  company?: { id: string; name: string } | null;
}

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'accountant' as 'admin' | 'accountant' | 'company',
  companyId: '',
};

const EMPTY_NEW_COMPANY = { name: '', street: '', psc: '', city: '', country: '', phone: '', email: '' };

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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showNewCompanyForm, setShowNewCompanyForm] = useState(false);
  const [newCompany, setNewCompany] = useState(EMPTY_NEW_COMPANY);
  const [tempPasswordNotice, setTempPasswordNotice] = useState<{ email: string; password: string } | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [resetConfirmUser, setResetConfirmUser] = useState<UserEntry | null>(null);

  const companiesWithAccount = new Set(
    users.filter((u) => u.role === 'company' && u.company).map((u) => u.company!.id)
  );

  useEffect(() => {
    getUsers()
      .then((res) => setUsers(res.users))
      .finally(() => setIsLoading(false));
    getCompanies()
      .then(setCompanies)
      .catch(() => {});
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.role === 'company' && !showNewCompanyForm && !form.companyId) {
      setFormError('Vyberte firmu alebo vytvorte novú.');
      return;
    }
    if (form.role === 'company' && showNewCompanyForm && !newCompany.name.trim()) {
      setFormError('Zadajte názov novej firmy.');
      return;
    }

    const resolvedEmail =
      form.role === 'company'
        ? showNewCompanyForm
          ? newCompany.email
          : companies.find((c) => c.id === form.companyId)?.email || ''
        : form.email;

    if (!resolvedEmail) {
      setFormError('Zadajte email.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    try {
      let companyId = form.companyId;

      if (form.role === 'company' && showNewCompanyForm) {
        const created = await createCompany(newCompany);
        companyId = created.id;
        setCompanies((prev) => [...prev, created]);
      }

      const res = await createUser({
        ...form,
        email: resolvedEmail,
        firstName: form.role === 'company' ? '' : form.firstName,
        lastName: form.role === 'company' ? '' : form.lastName,
        companyId: form.role === 'company' ? companyId : undefined,
      });
      setUsers((prev) => [...prev, res.user]);
      setTempPasswordNotice({ email: res.user.email, password: res.tempPassword });
      setForm(EMPTY_FORM);
      setNewCompany(EMPTY_NEW_COMPANY);
      setShowNewCompanyForm(false);
      setShowForm(false);
    } catch (err: any) {
      setFormError(err.message || 'Chyba pri vytváraní používateľa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetConfirmed = async () => {
    if (!resetConfirmUser) return;
    const u = resetConfirmUser;
    setResettingId(u.id);
    try {
      const res = await resetUserPassword(u.id);
      setTempPasswordNotice({ email: u.email, password: res.tempPassword });
      setResetConfirmUser(null);
    } catch (err: any) {
      alert(err.message || 'Heslo sa nepodarilo resetovať.');
    } finally {
      setResettingId(null);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmId) return;
    setIsDeleting(true);
    try {
      await deleteUser(confirmId);
      setUsers((prev) => prev.filter((u) => u.id !== confirmId));
      setConfirmId(null);
    } catch (err: any) {
      alert(err.message || 'Používateľa sa nepodarilo zmazať.');
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

      {tempPasswordNotice && (
        <div className="users-temp-password">
          <div>
            <strong>Dočasné heslo pre {tempPasswordNotice.email}:</strong>{' '}
            <code>{tempPasswordNotice.password}</code>
            <p className="users-temp-password-hint">
              Zároveň bolo odoslané na váš email — preposlite ho danej osobe/firme.
            </p>
          </div>
          <div className="users-temp-password-actions">
            <button
              type="button"
              className="users-link-btn"
              onClick={() => navigator.clipboard.writeText(tempPasswordNotice.password)}
              title="Kopírovať"
            >
              <Copy size={14} /> Kopírovať
            </button>
            <button
              type="button"
              className="users-temp-password-close"
              onClick={() => setTempPasswordNotice(null)}
              aria-label="Zavrieť"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <form className="users-form" onSubmit={handleCreate}>
          <h3 className="users-form-title">Nový používateľ</h3>
          {form.role !== 'company' && (
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
            </div>
          )}
          <p className="users-form-hint">Prístupové údaje (dočasné heslo) dostanete na svoj email.</p>
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
            <button
              type="button"
              className={`users-role-btn ${form.role === 'company' ? 'is-active' : ''}`}
              onClick={() => setForm((p) => ({ ...p, role: 'company' }))}
            >
              <Building2 size={14} /> Firma
            </button>
          </div>

          {form.role === 'company' && (
            <div className="users-company-section">
              {!showNewCompanyForm ? (
                <>
                  <div className="users-company-row">
                    <CustomDropdown
                      label="Firma, pre ktorú vytvárate účet"
                      placeholder="— Vyberte firmu zo zoznamu —"
                      options={companies.map((c) => ({
                        value: c.id,
                        label: c.name + (companiesWithAccount.has(c.id) ? ' (už má účet)' : ''),
                        disabled: companiesWithAccount.has(c.id),
                      }))}
                      value={form.companyId}
                      onChange={(v) => setForm((p) => ({ ...p, companyId: String(v) }))}
                      className="users-company-dropdown"
                    />
                  </div>
                  {form.companyId && (
                    <p className="users-company-hint">
                      Email účtu (z profilu firmy):{' '}
                      <strong>{companies.find((c) => c.id === form.companyId)?.email || '—'}</strong>
                    </p>
                  )}
                  <p className="users-company-hint">
                    Firma, pre ktorú chcete vytvoriť účet, ešte nie je v zozname?{' '}
                    <button type="button" className="users-link-btn" onClick={() => setShowNewCompanyForm(true)}>
                      Pridať novú firmu
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <p className="users-company-hint">Údaje novej firmy:</p>
                  <div className="users-new-company-form">
                    <input
                      className="users-input"
                      placeholder="Názov firmy *"
                      value={newCompany.name}
                      onChange={(e) => setNewCompany((p) => ({ ...p, name: e.target.value }))}
                    />
                    <input
                      className="users-input"
                      placeholder="Ulica"
                      value={newCompany.street}
                      onChange={(e) => setNewCompany((p) => ({ ...p, street: e.target.value }))}
                    />
                    <input
                      className="users-input"
                      placeholder="PSČ"
                      value={newCompany.psc}
                      onChange={(e) => setNewCompany((p) => ({ ...p, psc: e.target.value }))}
                    />
                    <input
                      className="users-input"
                      placeholder="Mesto"
                      value={newCompany.city}
                      onChange={(e) => setNewCompany((p) => ({ ...p, city: e.target.value }))}
                    />
                    <CustomDropdown
                      label="Krajina"
                      placeholder="— Krajina —"
                      options={COUNTRY_OPTIONS}
                      value={newCompany.country}
                      onChange={(v) => setNewCompany((p) => ({ ...p, country: String(v) }))}
                    />
                    <input
                      className="users-input"
                      placeholder="Telefón"
                      value={newCompany.phone}
                      onChange={(e) => setNewCompany((p) => ({ ...p, phone: e.target.value }))}
                    />
                    <input
                      className="users-input"
                      type="email"
                      placeholder="Email firmy * (bude aj emailom pre prihlásenie)"
                      value={newCompany.email}
                      onChange={(e) => setNewCompany((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <button
                    type="button"
                    className="users-link-btn"
                    onClick={() => { setShowNewCompanyForm(false); setNewCompany(EMPTY_NEW_COMPANY); }}
                  >
                    ← Vybrať existujúcu firmu zo zoznamu
                  </button>
                </>
              )}
            </div>
          )}

          {formError && <p className="users-form-error">{formError}</p>}
          <div className="users-form-actions">
            <button
              type="button"
              className="users-btn users-btn--cancel"
              onClick={() => {
                setShowForm(false);
                setForm(EMPTY_FORM);
                setFormError('');
                setShowNewCompanyForm(false);
                setNewCompany(EMPTY_NEW_COMPANY);
              }}
            >
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
                {u.role === 'admin' && <><Shield size={11} /> Admin</>}
                {u.role === 'accountant' && <><BookOpen size={11} /> Účtovník</>}
                {u.role === 'company' && <><Building2 size={11} /> {u.company?.name || 'Firma'}</>}
              </span>
              <button
                className="users-reset-btn"
                onClick={() => setResetConfirmUser(u)}
                disabled={u.id === currentUser?.id || resettingId === u.id}
                title={u.id === currentUser?.id ? 'Zmeňte si heslo cez "Zmeniť heslo" v menu' : 'Resetovať heslo'}
              >
                <KeyRound size={15} />
              </button>
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
      <ConfirmModal
        isOpen={!!resetConfirmUser}
        title="Resetovať heslo"
        message={`Naozaj chcete resetovať heslo pre ${resetConfirmUser?.email}? Aktuálne heslo prestane platiť a nové dočasné heslo dostanete na svoj email.`}
        onConfirm={handleResetConfirmed}
        onCancel={() => setResetConfirmUser(null)}
        isDeleting={!!resettingId}
      />
    </div>
  );
};

export default UsersPage;
