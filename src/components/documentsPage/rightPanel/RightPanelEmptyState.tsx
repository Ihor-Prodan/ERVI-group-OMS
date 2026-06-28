import { Folder } from 'lucide-react';
import './right-panel.css';

type Props = {
  selectedMonthIndex: number;
  selectedYear: number;
  MONTH_NAMES_SK: string[];
};

export const RightPanelEmptyState = ({
  selectedMonthIndex,
  selectedYear,
  MONTH_NAMES_SK,
}: Props) => {
  return (
    <div className="rp-empty">
      <div className="rp-empty-icon">
        <Folder className="rp-empty-icon-svg" />
      </div>

      <h4 className="rp-empty-title">
        Žiadne dokumenty
      </h4>

      <p className="rp-empty-description">
        Pre {MONTH_NAMES_SK[selectedMonthIndex]} {selectedYear} neboli zatiaľ
        pridané žiadne dokumenty. Kliknutím na tlačidlo hore môžete pridať prvý.
      </p>
    </div>
  );
};