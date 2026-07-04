import React, { useState, useRef } from 'react';
import { AlertCircle, Check, UploadCloud } from 'lucide-react';
import type { DocumentEntry } from '../types';
import { uploadDocumentFile } from '../../API/API';
import './documents-add-modal.css';

interface Props {
  onClose: () => void;
  onSubmit: (doc: Omit<DocumentEntry, 'id' | 'createdAt'>) => Promise<void>;
}

const todayStr = () => new Date().toISOString().split('T')[0];

export const DocumentsAddModal = ({ onClose, onSubmit }: Props) => {
  const [formData, setFormData] = useState({
    name: '',
    fileName: '',
    fileSize: '',
    fileType: '',
    category: 'faktura' as 'faktura' | 'priloha',
    sumWithDph: '',
    sumWithoutDph: '',
    dphRate: 23,
    date: todayStr(),
    dueDate: '',
    isPaid: false,
    visibleToAccountant: false,
    note: '',
  });

  const [fileAttachment, setFileAttachment] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVat = (type: 'sDph' | 'bezDph', val: string, rate?: number) => {
    const num = parseFloat(val);
    const multiplier = 1 + (rate ?? formData.dphRate) / 100;
    if (isNaN(num)) {
      setFormData(prev => ({ ...prev, sumWithDph: '', sumWithoutDph: '' }));
      return;
    }
    if (type === 'bezDph') {
      setFormData(prev => ({ ...prev, sumWithoutDph: val, sumWithDph: (num * multiplier).toFixed(2) }));
    } else {
      setFormData(prev => ({ ...prev, sumWithDph: val, sumWithoutDph: (num / multiplier).toFixed(2) }));
    }
  };

  const handleRateChange = (rate: number) => {
    setFormData(prev => {
      const multiplier = 1 + rate / 100;
      const withoutNum = parseFloat(prev.sumWithoutDph);
      const withNum = parseFloat(prev.sumWithDph);
      if (!isNaN(withoutNum)) {
        return { ...prev, dphRate: rate, sumWithDph: (withoutNum * multiplier).toFixed(2) };
      }
      if (!isNaN(withNum)) {
        return { ...prev, dphRate: rate, sumWithoutDph: (withNum / multiplier).toFixed(2) };
      }
      return { ...prev, dphRate: rate };
    });
  };

  const processFile = (file: File) => {
    setFileAttachment(file);
    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;
    setFormData(prev => ({
      ...prev,
      fileName: file.name,
      fileSize: sizeStr,
      fileType: file.type || 'application/octet-stream',
      name: prev.name || file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sumWith = parseFloat(formData.sumWithDph);
    const sumWithout = parseFloat(formData.sumWithoutDph);

    const isFaktura = formData.category === 'faktura';
    if (!formData.name || !formData.date || (isFaktura && (isNaN(sumWith) || isNaN(sumWithout)))) {
      setFormError(isFaktura
        ? 'Prosím, zadajte názov dokumentu, dátum a obe sumy s DPH aj bez DPH.'
        : 'Prosím, zadajte názov dokumentu a dátum.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    try {
      let fileUrl = '';
      let fileName = formData.fileName || `Dokument_${Date.now().toString().slice(-5)}.pdf`;
      let fileSize = formData.fileSize || '';
      let fileType = formData.fileType || 'application/pdf';

      if (fileAttachment) {
        const uploaded = await uploadDocumentFile(fileAttachment);
        fileUrl = uploaded.fileUrl;
        fileName = uploaded.fileName;
        fileSize = uploaded.fileSize;
        fileType = uploaded.fileType;
      }

      await onSubmit({
        name: formData.name,
        fileUrl,
        fileName,
        fileSize,
        fileType,
        category: formData.category,
        sumWithDph: formData.category === 'priloha' ? 0 : sumWith,
        sumWithoutDph: formData.category === 'priloha' ? 0 : sumWithout,
        dphRate: formData.dphRate,
        date: formData.date,
        dueDate: formData.category === 'priloha' ? undefined : formData.dueDate || undefined,
        isPaid: formData.category === 'priloha' ? true : formData.dueDate ? formData.isPaid : true,
        visibleToAccountant: formData.visibleToAccountant,
        note: formData.note,
      });
    } catch {
      setFormError('Chyba pri ukladaní dokumentu. Skúste to znova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="doc-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="doc-modal">
        <div className="doc-modal-header">
          <h3 className="doc-modal-title">Nahrať nový dokument</h3>
          <p className="doc-modal-subtitle">Priložte sken alebo súbor faktúry a zadajte sumy.</p>
        </div>

        {formError && (
          <div className="doc-modal-error">
            <AlertCircle className="doc-modal-error-icon" />
            <p>{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="doc-modal-form">
          {/* Kategória */}
          <div className="doc-modal-field">
            <label className="doc-modal-label">Typ dokumentu</label>
            <div className="doc-modal-rate-group">
              <button
                type="button"
                className={`doc-modal-rate-btn ${formData.category === 'faktura' ? 'is-active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, category: 'faktura' }))}
              >
                Faktúra
              </button>
              <button
                type="button"
                className={`doc-modal-rate-btn ${formData.category === 'priloha' ? 'is-active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, category: 'priloha' }))}
              >
                Iná príloha
              </button>
            </div>
          </div>

          {/* Drag & Drop */}
          <div className="doc-modal-field">
            <label className="doc-modal-label">Príloha (súbor dokumentu)</label>
            <div
              className={`doc-modal-dropzone ${dragActive ? 'is-drag-active' : ''} ${fileAttachment ? 'has-file' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              />
              {fileAttachment ? (
                <>
                  <div className="doc-modal-dropzone-icon doc-modal-dropzone-icon--success">
                    <Check size={18} />
                  </div>
                  <p className="doc-modal-dropzone-filename">{fileAttachment.name}</p>
                  <p className="doc-modal-dropzone-filesize">
                    {(fileAttachment.size / 1024).toFixed(0)} KB – úspešne priložené
                  </p>
                </>
              ) : (
                <>
                  <div className="doc-modal-dropzone-icon doc-modal-dropzone-icon--empty">
                    <UploadCloud size={20} />
                  </div>
                  <p className="doc-modal-dropzone-text">
                    Presuňte sken sem alebo{' '}
                    <span className="doc-modal-dropzone-link">vyberte súbor</span>
                  </p>
                  <p className="doc-modal-dropzone-hint">Podporované PDF, PNG, JPEG do 10 MB</p>
                </>
              )}
            </div>
          </div>

          {/* Názov */}
          <div className="doc-modal-field">
            <label className="doc-modal-label">Názov dokumentu *</label>
            <input
              type="text"
              className="doc-modal-input"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Napr. Faktúra za prepravu autodielov – Žilina"
            />
          </div>

          {/* Dátum dokumentu */}
          <div className="doc-modal-field">
            <label className="doc-modal-label">Dátum dokumentu *</label>
            <input
              type="date"
              className="doc-modal-input"
              value={formData.date}
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
            <span className="doc-modal-hint">
              Podľa zadaného dátumu sa dokument automaticky zaradí do príslušného roka a mesiaca.
            </span>
          </div>

          {formData.category === 'faktura' && (
            <>
              {/* Splatnosť + zaplatená */}
              <div className="doc-modal-grid">
                <div className="doc-modal-field">
                  <label className="doc-modal-label">Splatnosť (nepovinná)</label>
                  <input
                    type="date"
                    className="doc-modal-input"
                    value={formData.dueDate}
                    onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                <div className="doc-modal-field" style={{ justifyContent: 'flex-end' }}>
                  <div
                    className="doc-modal-checkbox-row"
                    onClick={() => setFormData(prev => ({ ...prev, isPaid: !prev.isPaid }))}
                  >
                    <input
                      type="checkbox"
                      id="isPaidCheck"
                      className="doc-modal-checkbox"
                      checked={formData.isPaid}
                      onChange={e => setFormData(prev => ({ ...prev, isPaid: e.target.checked }))}
                      onClick={e => e.stopPropagation()}
                    />
                    <label htmlFor="isPaidCheck" className="doc-modal-checkbox-label">
                      Faktúra už zaplatená
                    </label>
                  </div>
                </div>
              </div>

              {/* Sadzba DPH */}
              <div className="doc-modal-field">
                <label className="doc-modal-label">Sadzba DPH</label>
                <div className="doc-modal-rate-group">
                  {[0, 5, 10, 23].map(rate => (
                    <button
                      key={rate}
                      type="button"
                      className={`doc-modal-rate-btn ${formData.dphRate === rate ? 'is-active' : ''}`}
                      onClick={() => handleRateChange(rate)}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Sumy */}
              <div className="doc-modal-grid">
                <div className="doc-modal-field">
                  <label className="doc-modal-label">Suma bez DPH (€) *</label>
                  <div className="doc-modal-input-wrapper">
                    <input
                      type="number"
                      step="0.01"
                      className="doc-modal-input doc-modal-input--number"
                      value={formData.sumWithoutDph}
                      onChange={e => handleVat('bezDph', e.target.value)}
                      placeholder="0.00"
                    />
                    <span className="doc-modal-input-suffix">bez DPH</span>
                  </div>
                </div>
                <div className="doc-modal-field">
                  <label className="doc-modal-label">Suma s DPH ({formData.dphRate}%) *</label>
                  <div className="doc-modal-input-wrapper">
                    <input
                      type="number"
                      step="0.01"
                      className="doc-modal-input doc-modal-input--number"
                      value={formData.sumWithDph}
                      onChange={e => handleVat('sDph', e.target.value)}
                      placeholder="0.00"
                    />
                    <span className="doc-modal-input-suffix">s DPH</span>
                  </div>
                </div>
              </div>
              <span className="doc-modal-hint">
                Obe sumy sa automaticky dopočítavajú podľa zvolenej sadzby DPH.
              </span>
            </>
          )}

          {/* Viditeľnosť pre účtovníka */}
          <div className="doc-modal-field">
            <div
              className="doc-modal-checkbox-row"
              onClick={() => setFormData(prev => ({ ...prev, visibleToAccountant: !prev.visibleToAccountant }))}
            >
              <input
                type="checkbox"
                id="visibleCheck"
                className="doc-modal-checkbox"
                checked={formData.visibleToAccountant}
                onChange={e => setFormData(prev => ({ ...prev, visibleToAccountant: e.target.checked }))}
                onClick={e => e.stopPropagation()}
              />
              <label htmlFor="visibleCheck" className="doc-modal-checkbox-label">
                Viditeľné pre účtovníka
              </label>
            </div>
          </div>

          {/* Poznámka */}
          <div className="doc-modal-field">
            <label className="doc-modal-label">Poznámka (nepovinná)</label>
            <input
              type="text"
              className="doc-modal-input"
              value={formData.note}
              onChange={e => setFormData(prev => ({ ...prev, note: e.target.value }))}
              placeholder="Napr. Preplatené dodávateľom, splatnosť..."
            />
          </div>

          <div className="doc-modal-actions">
            <button
              type="button"
              className="doc-modal-btn doc-modal-btn--cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Zrušiť
            </button>
            <button
              type="submit"
              className="doc-modal-btn doc-modal-btn--submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Ukladá sa...' : 'Uložiť dokument'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
