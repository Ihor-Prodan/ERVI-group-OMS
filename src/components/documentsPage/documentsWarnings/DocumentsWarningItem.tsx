import { Check } from 'lucide-react';

interface Props {
  warning: {
    doc: any;
    daysDiff: number;
    isOverdue: boolean;
  };
  onTogglePaid: (id: string) => void;
}

export const DocumentsWarningItem = ({ warning, onTogglePaid }: Props) => {
  const { doc, daysDiff, isOverdue } = warning;

  const formatDays = (d: number) => {
    const abs = Math.abs(d);
    if (abs === 1) return 'deň';
    if (abs >= 2 && abs <= 4) return 'dni';
    return 'dní';
  };

  return (
    <div className={`documents-warning-item ${isOverdue ? 'overdue' : 'normal'}`}>
      
      <div className="documents-warning-item__content">

        <div className="documents-warning-item__top">
          <span className={`dot ${isOverdue ? 'red' : 'orange'}`} />
          <span className="name">{doc.name}</span>
        </div>

        <p className="details">
          {isOverdue ? (
            <span className="text-red">
              Po splatnosti o {Math.abs(daysDiff)} {formatDays(daysDiff)}
            </span>
          ) : daysDiff === 0 ? (
            <span className="text-orange">
              Splatnosť vyprší dnes!
            </span>
          ) : (
            <span className="text-orange">
              Splatnosť vyprší o {daysDiff} {formatDays(daysDiff)}
            </span>
          )}

          {' '}• Splatné dňa:{' '}
          <span className="strong">
            {new Date(doc.dueDate!).toLocaleDateString('sk-SK')}
          </span>

          {' '}• Suma:{' '}
          <span className="strong">
            {doc.sumWithDph.toLocaleString('sk-SK', {
              minimumFractionDigits: 2,
            })} €
          </span>
        </p>
      </div>

      <button
        onClick={() => onTogglePaid(doc.id)}
        className="documents-warning-item__button"
      >
        <Check size={14} />
        Potvrdiť zaplatenie
      </button>

    </div>
  );
};