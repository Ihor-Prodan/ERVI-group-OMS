import { useState } from 'react';
import { mergePrintDocuments } from '../../API/API';
import { Download, Trash2, Check, Clock, Calendar, Eye, EyeOff, Printer } from 'lucide-react';
import type { DocumentEntry } from '../types';
import { RightPanelHeader } from './RightPanelHeader';
import { RightPanelEmptyState } from './RightPanelEmptyState';
import './right-panel.css';

interface Props {
  selectedMonthIndex: number;
  selectedYear: number;
  monthlyDocs: DocumentEntry[];
  monthlyWithDph: number;
  monthlyWithoutDph: number;
  MONTH_NAMES_SK: string[];
  getDaysDiff: (dueStr: string) => number;
  isAdmin: boolean;
  onTogglePaid: (id: string) => void;
  onToggleVisibility: (id: string, visibleToAccountant: boolean) => void;
  onDelete: (id: string) => void;
  onDownload: (doc: DocumentEntry) => void;
}

export const DocumentsRightPanel = ({
  selectedMonthIndex,
  selectedYear,
  monthlyDocs,
  monthlyWithDph,
  monthlyWithoutDph,
  MONTH_NAMES_SK,
  getDaysDiff,
  isAdmin,
  onTogglePaid,
  onToggleVisibility,
  onDelete,
  onDownload,
}: Props) => {
  const [activeCategory, setActiveCategory] = useState<'faktura' | 'priloha'>('faktura');
  const [isPrinting, setIsPrinting] = useState(false);

  const filteredDocs = monthlyDocs.filter(d => (d.category ?? 'faktura') === activeCategory);
  const filteredWithDph = filteredDocs.reduce((s, d) => s + d.sumWithDph, 0);
  const filteredWithoutDph = filteredDocs.reduce((s, d) => s + d.sumWithoutDph, 0);
  void monthlyWithDph; void monthlyWithoutDph;

  const handlePrint = async () => {
    if (filteredDocs.length === 0) return;
    setIsPrinting(true);
    try {
      const ids = filteredDocs.map(d => d.id);
      const blob = await mergePrintDocuments(ids);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="rp-panel">
      <div className="rp-body">
        <RightPanelHeader
          selectedMonthIndex={selectedMonthIndex}
          selectedYear={selectedYear}
          monthlyDocs={monthlyDocs}
          MONTH_NAMES_SK={MONTH_NAMES_SK}
        />

        <div className="rp-tabs-bar">
          <div className="rp-tabs">
            <button
              className={`rp-tab ${activeCategory === 'faktura' ? 'rp-tab--active' : ''}`}
              onClick={() => setActiveCategory('faktura')}
            >
              Faktúry
            </button>
            <button
              className={`rp-tab ${activeCategory === 'priloha' ? 'rp-tab--active' : ''}`}
              onClick={() => setActiveCategory('priloha')}
            >
              Iné prílohy
            </button>
          </div>
          {filteredDocs.length > 0 && (
            <button className="rp-print-btn" onClick={handlePrint} disabled={isPrinting} title="Tlačiť všetky dokumenty">
              <Printer size={15} />
              {isPrinting ? 'Načítava...' : 'Tlačiť všetko'}
            </button>
          )}
        </div>

        {filteredDocs.length === 0 ? (
          <RightPanelEmptyState
            selectedMonthIndex={selectedMonthIndex}
            selectedYear={selectedYear}
            MONTH_NAMES_SK={MONTH_NAMES_SK}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="rp-table-wrapper">
              <table className="rp-table">
                <thead>
                  <tr className="rp-table-head-row">
                    <th className="rp-th">Názov a Súbor</th>
                    <th className="rp-th">Dátum</th>
                    <th className="rp-th">Splatnosť a Stav</th>
                    <th className="rp-th rp-th--right">Suma bez DPH</th>
                    <th className="rp-th rp-th--right">Suma DPH</th>
                    <th className="rp-th rp-th--right">Suma s DPH</th>
                    <th className="rp-th rp-th--center">Formát</th>
                    <th className="rp-th rp-th--center">Akcie</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map(doc => {
                    const fileExt = doc.fileName
                      .substring(doc.fileName.lastIndexOf('.') + 1)
                      .toUpperCase();

                    return (
                      <tr key={doc.id} className="rp-table-row">
                        <td className="rp-td rp-td--name">
                          <span className="rp-doc-name" title={doc.name}>{doc.name}</span>
                          <span className="rp-doc-file">
                            {doc.fileName} ({doc.fileSize || 'N/A'})
                          </span>
                          {doc.note && (
                            <span className="rp-doc-note" title={doc.note}>
                              Poznámka: {doc.note}
                            </span>
                          )}
                        </td>

                        <td className="rp-td rp-td--date">
                          {new Date(doc.date).toLocaleDateString('sk-SK')}
                        </td>

                        <td className="rp-td rp-td--status">
                          {doc.dueDate ? (
                            <div className="rp-status-cell">
                              <span className="rp-due-date">
                                {new Date(doc.dueDate).toLocaleDateString('sk-SK')}
                              </span>
                              {doc.isPaid ? (
                                <span className="rp-badge rp-badge--paid">
                                  <Check size={12} />
                                  Uhradené
                                </span>
                              ) : isAdmin ? (
                                <button
                                  onClick={() => onTogglePaid(doc.id)}
                                  className={`rp-status-btn ${getDaysDiff(doc.dueDate) < 0 ? 'rp-status-btn--overdue' : 'rp-status-btn--pending'}`}
                                  title="Kliknutím označte ako uhradené"
                                >
                                  <Clock size={13} className="rp-clock-icon" />
                                  Neuhradené
                                </button>
                              ) : (
                                <span className={`rp-badge ${getDaysDiff(doc.dueDate) < 0 ? 'rp-status-btn--overdue' : 'rp-status-btn--pending'}`}>
                                  Neuhradené
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="rp-no-due">Bez splatnosti</span>
                          )}
                        </td>

                        <td className="rp-td rp-td--sum rp-td--right">
                          {doc.sumWithoutDph.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €
                        </td>

                        <td className="rp-td rp-td--sum rp-td--right">
                          {(doc.sumWithDph - doc.sumWithoutDph).toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €
                        </td>

                        <td className="rp-td rp-td--sum rp-td--right rp-td--bold">
                          {doc.sumWithDph.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €
                        </td>

                        <td className="rp-td rp-td--center">
                          <span className={`rp-format-badge ${fileExt === 'PDF' ? 'rp-format-badge--pdf' : 'rp-format-badge--other'}`}>
                            {fileExt}
                          </span>
                        </td>

                        <td className="rp-td rp-td--center">
                          <div className="rp-actions">
                            {isAdmin && (
                              <button
                                onClick={() => onToggleVisibility(doc.id, !doc.visibleToAccountant)}
                                className="rp-action-btn"
                                title={doc.visibleToAccountant ? 'Skryť pre účtovníka' : 'Zobraziť pre účtovníka'}
                              >
                                {doc.visibleToAccountant ? <Eye size={16} /> : <EyeOff size={16} />}
                              </button>
                            )}
                            <button
                              onClick={() => onDownload(doc)}
                              className="rp-action-btn"
                              title="Stiahnuť súbor"
                            >
                              <Download size={16} />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => onDelete(doc.id)}
                                className="rp-action-btn rp-action-btn--delete"
                                title="Zmazať"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="rp-cards-wrapper">
              {filteredDocs.map(doc => {
                const fileExt = doc.fileName
                  .substring(doc.fileName.lastIndexOf('.') + 1)
                  .toUpperCase();

                return (
                  <div key={doc.id} className="rp-card">
                    <div className="rp-card-top">
                      <div className="rp-card-title-block">
                        <span className="rp-card-name">{doc.name}</span>
                        <span className="rp-card-file">
                          {doc.fileName} ({doc.fileSize || 'N/A'})
                        </span>
                      </div>
                      <span className={`rp-format-badge rp-format-badge--sm ${fileExt === 'PDF' ? 'rp-format-badge--pdf' : 'rp-format-badge--other'}`}>
                        {fileExt}
                      </span>
                    </div>

                    {doc.note && (
                      <div className="rp-card-note">{doc.note}</div>
                    )}

                    <div className="rp-card-meta">
                      <div>
                        <span className="rp-card-meta-label">Dátum</span>
                        <span className="rp-card-meta-value">
                          {new Date(doc.date).toLocaleDateString('sk-SK')}
                        </span>
                      </div>
                      <div className="rp-card-meta-right">
                        <span className="rp-card-meta-label">Suma s DPH</span>
                        <span className="rp-card-sum">
                          {doc.sumWithDph.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €
                        </span>
                      </div>
                    </div>

                    {doc.dueDate && (
                      <div className="rp-card-due">
                        <span className="rp-card-due-label">
                          <Calendar size={14} />
                          Splatnosť:
                        </span>
                        <div className="rp-card-due-right">
                          <span className="rp-card-due-date">
                            {new Date(doc.dueDate).toLocaleDateString('sk-SK')}
                          </span>
                          {doc.isPaid ? (
                            <span className="rp-badge rp-badge--paid">Uhradené</span>
                          ) : isAdmin ? (
                            <button
                              onClick={() => onTogglePaid(doc.id)}
                              className={`rp-status-btn ${getDaysDiff(doc.dueDate) < 0 ? 'rp-status-btn--overdue' : 'rp-status-btn--pending'}`}
                              title="Označiť ako uhradené"
                            >
                              {getDaysDiff(doc.dueDate) < 0 ? 'Dlh - Uhradiť' : 'Uhradiť'}
                            </button>
                          ) : (
                            <span className={`rp-badge ${getDaysDiff(doc.dueDate) < 0 ? 'rp-status-btn--overdue' : 'rp-status-btn--pending'}`}>Neuhradené</span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="rp-card-secondary-sum">
                      <span>Bez DPH:</span>
                      <span className="rp-card-secondary-value">
                        {doc.sumWithoutDph.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €
                      </span>
                    </div>

                    <div className="rp-card-actions">
                      {isAdmin && (
                        <button
                          onClick={() => onToggleVisibility(doc.id, !doc.visibleToAccountant)}
                          className="rp-card-btn"
                        >
                          {doc.visibleToAccountant ? <Eye size={14} /> : <EyeOff size={14} />}
                          {doc.visibleToAccountant ? 'Skryť' : 'Zobraziť'}
                        </button>
                      )}
                      <button
                        onClick={() => onDownload(doc)}
                        className="rp-card-btn"
                      >
                        <Download size={14} />
                        Stiahnuť
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => onDelete(doc.id)}
                          className="rp-card-btn rp-card-btn--delete"
                        >
                          <Trash2 size={14} />
                          Zmazať
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {filteredDocs.length > 0 && (
        <div className="rp-footer">
          <div className="rp-footer-left">
            <span className="rp-footer-period-label">Súhrn za obdobie</span>
            <span className="rp-footer-period">
              {MONTH_NAMES_SK[selectedMonthIndex]} {selectedYear}
            </span>
          </div>
          <div className="rp-footer-sums">
            <div className="rp-footer-sum-row">
              <span className="rp-footer-sum-label">Spolu bez DPH:</span>
              <span className="rp-footer-sum-value">
                {filteredWithoutDph.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €
              </span>
            </div>
            <div className="rp-footer-divider" />
            <div className="rp-footer-sum-row">
              <span className="rp-footer-sum-label">Spolu DPH:</span>
              <span className="rp-footer-sum-value">
                {(filteredWithDph - filteredWithoutDph).toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €
              </span>
            </div>
            <div className="rp-footer-divider" />
            <div className="rp-footer-sum-row">
              <span className="rp-footer-sum-label">Spolu s DPH:</span>
              <span className="rp-footer-sum-value rp-footer-sum-value--total">
                {filteredWithDph.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
