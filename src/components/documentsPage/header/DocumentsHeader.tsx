import { Plus } from 'lucide-react';
import './DocumentsHeader.css';

interface Props {
  isAdmin: boolean;
  onAddDocument: () => void;
}

export const DocumentsHeader = ({ isAdmin, onAddDocument }: Props) => {
  return (
    <div className="documents-header">
      <div className="documents-header__content">
        <h1 className="documents-header__title">
          EVIDENCIA DOKUMENTOV
        </h1>

        <p className="documents-header__description">
          Archív dokumentov rozdelený podľa období s automatickým prepočtom a sumovaním DPH.
        </p>
      </div>

      {isAdmin && (
        <button onClick={onAddDocument} className="documents-header__button">
          <Plus size={16} />
          <span>Nahrať nový dokument</span>
        </button>
      )}
    </div>
  );
};