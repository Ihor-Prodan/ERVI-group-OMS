import { AlertCircle } from 'lucide-react';
import './DocumentsWarnings.css';
import { DocumentsWarningItem } from './DocumentsWarningItem';

export interface WarningDoc {
  doc: any;
  daysDiff: number;
  isOverdue: boolean;
}

interface Props {
  warningsList: WarningDoc[];
  onTogglePaid: (id: string) => void;
}

export const DocumentsWarnings = ({ warningsList, onTogglePaid }: Props) => {
  if (!warningsList.length) return null;

  return (
    <div className="documents-warnings">
      
      <div className="documents-warnings__header">
        <AlertCircle className="documents-warnings__icon" />

        <h3 className="documents-warnings__title">
          Upozornenie na splatnosť neuhradených faktúr ({warningsList.length})
        </h3>
      </div>

      <div className="documents-warnings__list">
        {warningsList.map((item) => (
          <DocumentsWarningItem
            key={item.doc.id}
            warning={item}
            onTogglePaid={onTogglePaid}
          />
        ))}
      </div>
    </div>
  );
};