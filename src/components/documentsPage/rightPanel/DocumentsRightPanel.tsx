import { useState } from 'react';
import { getDocumentPresignedUrl } from '../../API/API';
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
  const [isPrinting, setIsPrinting] = useState(false);

  const filteredDocs = monthlyDocs.filter(d => (d.category ?? 'faktura') === activeCategory);
  const filteredWithDph = filteredDocs.reduce((s, d) => s + d.sumWithDph, 0);
  const filteredWithoutDph = filteredDocs.reduce((s, d) => s + d.sumWithoutDph, 0);
  void monthlyWithDph; void monthlyWithoutDph;

  const handlePrint = async () => {
    const printDocs = allDocs
      .filter(d => (d.category ?? 'faktura') === activeCategory)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (printDocs.length === 0) return;

    setIsPrinting(true);
    try {
      const results = await Promise.allSettled(
        printDocs.map(doc => getDocumentPresignedUrl(doc.id))
      );

      const docsWithUrls = printDocs
        .map((doc, i) => ({
          doc,
          url: results[i].status === 'fulfilled' ? (results[i] as PromiseFulfilledResult<{ url: string }>).value.url : null,
        }))
        .filter(d => d.url !== null);

      const win = window.open('', '_blank');
      if (!win) return;

      const embeds = docsWithUrls.map(({ doc, url }) => {
        const isImage = doc.fileType?.startsWith('image/');
        const embed = isImage
          ? `<img src="${url}" style="max-width:100%; display:block;" />`
          : `<iframe src="${url}" style="width:100%; height:1100px; border:none;" title="${doc.name}"></iframe>`;
        return `
          <div class="doc-block">
            <div class="doc-label">${doc.name} &mdash; ${new Date(doc.date).toLocaleDateString('sk-SK')}${doc.note ? ` &mdash; ${doc.note}` : ''}</div>
            ${embed}
          </div>`;
      }).join('');

      const title = activeCategory === 'faktura' ? 'Faktúry – všetky' : 'Iné prílohy – všetky';

      win.document.open();
      win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${title}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; background: #f0f0f0; }
          .toolbar { position: fixed; top: 0; left: 0; right: 0; background: #1e293b; color: #fff;
            padding: 10px 20px; display: flex; align-items: center; gap: 16px; z-index: 100; }
          .toolbar h1 { font-size: 14px; font-weight: 600; flex: 1; }
          .toolbar button { padding: 7px 18px; background: #3563e9; color: #fff; border: none;
            border-radius: 7px; font-size: 13px; font-weight: 700; cursor: pointer; }
          .toolbar button:hover { background: #2451c7; }
          .content { padding: 70px 20px 40px; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
          .doc-block { background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.12); }
          .doc-label { padding: 8px 14px; font-size: 11px; font-weight: 600; color: #64748b;
            background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
          @media print {
            .toolbar { display: none; }
            .content { padding: 0; max-width: 100%; gap: 0; }
            .doc-block { box-shadow: none; border-radius: 0; page-break-after: always; }
            .doc-label { border-bottom: none; }
            body { background: #fff; }
          }
        </style>
      </head><body>
        <div class="toolbar">
          <h1>${title} (${docsWithUrls.length} dokumentov)</h1>
          <button onclick="window.print()">🖨 Tlačiť</button>
        </div>
        <div class="content">${embeds}</div>
      </body></html>`);
      win.document.close();
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
          {allDocs.some(d => (d.category ?? 'faktura') === activeCategory) && (
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
