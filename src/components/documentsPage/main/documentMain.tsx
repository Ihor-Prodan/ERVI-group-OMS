import { useState } from 'react';
import { getDocumentPresignedUrl } from '../../API/API';
import type { DocumentEntry } from '../types';
import './documentMain.css';
import { DocumentsHeader } from '../header/DocumentsHeader';
import { DocumentsStats } from '../documentsStats/DocumentsStats';
import { DocumentsWarnings } from '../documentsWarnings/DocumentsWarnings';
import { DocumentMobilePeriodPicker } from '../periodPicker/DocumentMobilePeriodPicker';
import { DocumentDesktopPeriodTree } from '../periodTree/DocumentDesktopPeriodTree';
import { DocumentsRightPanel } from '../rightPanel/DocumentsRightPanel';
import { DocumentsAddModal } from '../addModal/DocumentsAddModal';
import ConfirmModal from '../../comfirmModal/ComfirmModal';

interface DocumentsSectionProps {
  documents: DocumentEntry[];
  isAdmin: boolean;
  onAddDocument: (doc: Omit<DocumentEntry, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteDocument: (id: string) => Promise<void>;
  onTogglePaidDocument: (id: string) => Promise<void>;
  onToggleVisibilityDocument: (id: string, visible: boolean) => Promise<void>;
}

const MONTH_NAMES_SK = [
  'Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún',
  'Júl', 'August', 'September', 'Október', 'November', 'December',
];

export default function DocumentsSection({
  documents,
  isAdmin,
  onAddDocument,
  onDeleteDocument,
  onTogglePaidDocument,
  onToggleVisibilityDocument,
}: DocumentsSectionProps) {
  const docYears = Array.from(new Set(documents.map(d => new Date(d.date).getFullYear())));
  const defaultYears = [new Date().getFullYear(), new Date().getFullYear() - 1];
  const years = Array.from(new Set([...defaultYears, ...docYears])).sort((a, b) => b - a);

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(now.getMonth());
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({
    [now.getFullYear()]: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    action: 'delete' | 'togglePaid';
    id: string;
    message: string;
  } | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const toggleYear = (yr: number) => {
    setExpandedYears(prev => ({ ...prev, [yr]: !prev[yr] }));
    setSelectedYear(yr);
  };

  const selectYearMonth = (year: number, monthIdx: number) => {
    setSelectedYear(year);
    setSelectedMonthIndex(monthIdx);
  };

  const getDaysDiff = (dueStr: string) => {
    const due = new Date(dueStr);
    const current = new Date();
    due.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);
    return Math.ceil((due.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
  };

  const warningsList = documents
    .filter(doc => doc.dueDate && !doc.isPaid)
    .map(doc => {
      const daysDiff = getDaysDiff(doc.dueDate!);
      return { doc, daysDiff, isOverdue: daysDiff < 0 };
    })
    .sort((a, b) => a.daysDiff - b.daysDiff);

  const grandWithDph = documents.reduce((s, d) => s + d.sumWithDph, 0);
  const grandWithoutDph = documents.reduce((s, d) => s + d.sumWithoutDph, 0);

  const yearlyDocs = documents.filter(d => new Date(d.date).getFullYear() === selectedYear);
  const yearlyWithDph = yearlyDocs.reduce((s, d) => s + d.sumWithDph, 0);
  const yearlyWithoutDph = yearlyDocs.reduce((s, d) => s + d.sumWithoutDph, 0);

  const monthlyDocs = documents
    .filter(d => {
      const date = new Date(d.date);
      return date.getFullYear() === selectedYear && date.getMonth() === selectedMonthIndex;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const monthlyWithDph = monthlyDocs.reduce((s, d) => s + d.sumWithDph, 0);
  const monthlyWithoutDph = monthlyDocs.reduce((s, d) => s + d.sumWithoutDph, 0);

  const getDocumentCountForMonth = (yr: number, mIdx: number) =>
    documents.filter(d => {
      const date = new Date(d.date);
      return date.getFullYear() === yr && date.getMonth() === mIdx;
    }).length;

  const getDocumentCountForYear = (yr: number) =>
    documents.filter(d => new Date(d.date).getFullYear() === yr).length;

  const handleDeleteWithConfirm = (id: string) => {
    setConfirmState({ action: 'delete', id, message: 'Naozaj chcete zmazať tento dokument? Táto akcia je nevratná.' });
  };

  const handleTogglePaidWithConfirm = (id: string) => {
    const doc = documents.find(d => d.id === id);
    const message = doc?.isPaid
      ? 'Naozaj chcete označiť túto faktúru ako neuhradenú?'
      : 'Naozaj chcete označiť túto faktúru ako uhradenú?';
    setConfirmState({ action: 'togglePaid', id, message });
  };

  const handleConfirmAction = async () => {
    if (!confirmState) return;
    setIsConfirming(true);
    try {
      if (confirmState.action === 'delete') await onDeleteDocument(confirmState.id);
      else await onTogglePaidDocument(confirmState.id);
      setConfirmState(null);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleDownload = async (doc: DocumentEntry) => {
    const win = window.open('', '_blank');
    try {
      const { url } = await getDocumentPresignedUrl(doc.id);
      if (win) win.location.href = url;
    } catch {
      if (win) win.close();
      alert('Nepodarilo sa získať odkaz na súbor.');
    }
  };

  const handleModalSubmit = async (data: Omit<DocumentEntry, 'id' | 'createdAt'>) => {
    await onAddDocument(data);
    const docDate = new Date(data.date);
    setSelectedYear(docDate.getFullYear());
    setSelectedMonthIndex(docDate.getMonth());
    setExpandedYears(prev => ({ ...prev, [docDate.getFullYear()]: true }));
    setIsModalOpen(false);
  };

  return (
    <div className="documents-section">
      <DocumentsHeader isAdmin={isAdmin} onAddDocument={() => setIsModalOpen(true)} />


      <DocumentsStats
        selectedYear={selectedYear}
        selectedMonthName={MONTH_NAMES_SK[selectedMonthIndex]}
        monthlyWithDph={monthlyWithDph}
        monthlyWithoutDph={monthlyWithoutDph}
        monthlyCount={monthlyDocs.length}
        yearlyWithDph={yearlyWithDph}
        yearlyWithoutDph={yearlyWithoutDph}
        yearlyCount={yearlyDocs.length}
        grandWithDph={grandWithDph}
        grandWithoutDph={grandWithoutDph}
        grandCount={documents.length}
      />

      {warningsList.length > 0 && (
        <DocumentsWarnings
          warningsList={warningsList}
          onTogglePaid={handleTogglePaidWithConfirm}
        />
      )}

      <div className="documents-workspace">
        <DocumentMobilePeriodPicker
          years={years}
          selectedYear={selectedYear}
          selectedMonthIndex={selectedMonthIndex}
          setSelectedYear={setSelectedYear}
          setSelectedMonthIndex={setSelectedMonthIndex}
          setExpandedYears={setExpandedYears}
          getDocumentCountForYear={getDocumentCountForYear}
          getDocumentCountForMonth={getDocumentCountForMonth}
          MONTH_NAMES_SK={MONTH_NAMES_SK}
        />

        <DocumentDesktopPeriodTree
          years={years}
          selectedYear={selectedYear}
          selectedMonthIndex={selectedMonthIndex}
          expandedYears={expandedYears}
          toggleYear={toggleYear}
          selectYearMonth={selectYearMonth}
          getDocumentCountForYear={getDocumentCountForYear}
          getDocumentCountForMonth={getDocumentCountForMonth}
          MONTH_NAMES_SK={MONTH_NAMES_SK}
        />

        <DocumentsRightPanel
          selectedMonthIndex={selectedMonthIndex}
          selectedYear={selectedYear}
          monthlyDocs={monthlyDocs}
          monthlyWithDph={monthlyWithDph}
          monthlyWithoutDph={monthlyWithoutDph}
          MONTH_NAMES_SK={MONTH_NAMES_SK}
          getDaysDiff={getDaysDiff}
          isAdmin={isAdmin}
          onTogglePaid={handleTogglePaidWithConfirm}
          onToggleVisibility={(id, visible) => onToggleVisibilityDocument(id, visible)}
          onDelete={handleDeleteWithConfirm}
          onDownload={handleDownload}
        />
      </div>

      {isModalOpen && isAdmin && (
        <DocumentsAddModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}

      <ConfirmModal
        isOpen={!!confirmState}
        title={confirmState?.action === 'delete' ? 'Zmazať dokument' : 'Zmena stavu platby'}
        message={confirmState?.message ?? ''}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmState(null)}
        isDeleting={isConfirming}
      />
    </div>
  );
}
