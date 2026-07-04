import { useState } from 'react';
import { Download, Trash2, Check, Clock, Calendar, Eye, EyeOff, Printer } from 'lucide-react';
import type { DocumentEntry } from '../types';
import { RightPanelHeader } from './RightPanelHeader';
import { RightPanelEmptyState } from './RightPanelEmptyState';
import './right-panel.css';

interface Props {
  selectedMonthIndex: number;
  selectedYear: number;
  allDocs: DocumentEntry[];
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
  allDocs,
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

  const filteredDocs = monthlyDocs.filter(d => (d.category ?? 'faktura') === activeCategory);
  const filteredWithDph = filteredDocs.reduce((s, d) => s + d.sumWithDph, 0);
  const filteredWithoutDph = filteredDocs.reduce((s, d) => s + d.sumWithoutDph, 0);
  void monthlyWithDph; void monthlyWithoutDph;

  const handlePrint = () => {
    const isFaktura = activeCategory === 'faktura';
    const title = isFaktura ? 'Faktúry – všetky' : 'Iné prílohy – všetky';

    const printDocs = allDocs
      .filter(d => (d.category ?? 'faktura') === activeCategory)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Group by year-month
    const groups: Record<string, DocumentEntry[]> = {};
    for (const doc of printDocs) {
      const d = new Date(doc.date);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(doc);
    }

    const makeRow = (doc: DocumentEntry) => `
      <tr>
        <td>${doc.name}</td>
        <td>${doc.fileName}</td>
        <td>${new Date(doc.date).toLocaleDateString('sk-SK')}</td>
        ${isFaktura ? `
          <td>${doc.dueDate ? new Date(doc.dueDate).toLocaleDateString('sk-SK') : '–'}</td>
          <td>${doc.isPaid ? 'Áno' : 'Nie'}</td>
          <td style="text-align:right">${doc.sumWithoutDph.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</td>
          <td style="text-align:right">${(doc.sumWithDph - doc.sumWithoutDph).toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</td>
          <td style="text-align:right"><strong>${doc.sumWithDph.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</strong></td>
        ` : ''}
        <td>${doc.note || '–'}</td>
      </tr>`;

    const sections = Object.entries(groups).map(([key, docs]) => {
      const [year, monthIdx] = key.split('-');
      const monthLabel = `${MONTH_NAMES_SK[Number(monthIdx)]} ${year}`;
      const withDph = docs.reduce((s, d) => s + d.sumWithDph, 0);
      const withoutDph = docs.reduce((s, d) => s + d.sumWithoutDph, 0);

      const tfoot = isFaktura ? `
        <tfoot>
          <tr style="font-weight:bold; border-top:2px solid #000; background:#f5f5f5">
            <td colspan="5">Spolu ${monthLabel}</td>
            <td style="text-align:right">${withoutDph.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</td>
            <td style="text-align:right">${(withDph - withoutDph).toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</td>
            <td style="text-align:right">${withDph.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</td>
            <td></td>
          </tr>
        </tfoot>` : '';

      return `
        <h2 style="font-size:13px; margin: 24px 0 8px; color:#444">${monthLabel}</h2>
        <table>
          <thead>
            <tr>
              <th>Názov</th><th>Súbor</th><th>Dátum</th>
              ${isFaktura ? '<th>Splatnosť</th><th>Zaplatené</th><th>Bez DPH</th><th>DPH</th><th>S DPH</th>' : ''}
              <th>Poznámka</th>
            </tr>
          </thead>
          <tbody>${docs.map(makeRow).join('')}</tbody>
          ${tfoot}
        </table>`;
    }).join('');

    const totalWithDph = printDocs.reduce((s, d) => s + d.sumWithDph, 0);
    const totalWithoutDph = printDocs.reduce((s, d) => s + d.sumWithoutDph, 0);
    const grandTotal = isFaktura ? `
      <div style="margin-top:24px; padding:12px; background:#eef2ff; border:1px solid #c7d2fe; border-radius:6px; font-family:monospace">
        <strong>Celkový súčet (všetky obdobia):</strong>
        &nbsp;&nbsp; Bez DPH: <strong>${totalWithoutDph.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</strong>
        &nbsp;&nbsp; DPH: <strong>${(totalWithDph - totalWithoutDph).toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</strong>
        &nbsp;&nbsp; S DPH: <strong>${totalWithDph.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</strong>
      </div>` : '';

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11px; margin: 20px; }
        h1 { font-size: 16px; margin-bottom: 4px; }
        h2 { page-break-before: auto; }
        table { width:100%; border-collapse:collapse; margin-bottom:8px; }
        th, td { border:1px solid #ccc; padding:5px 7px; text-align:left; }
        th { background:#f0f0f0; font-weight:bold; }
        @media print { button { display:none; } }
      </style></head>
      <body>
        <h1>${title}</h1>
        <p style="color:#666; font-size:11px">Vytlačené: ${new Date().toLocaleDateString('sk-SK')}</p>
        ${sections}
        ${grandTotal}
      </body></html>`;

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="rp-panel">
      <div>
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
          {allDocs.some(d => (d.category ?? 'faktura') === activeCategory) && (
            <button className="rp-print-btn" onClick={handlePrint} title="Tlačiť všetko">
              <Printer size={15} />
              Tlačiť všetko
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
