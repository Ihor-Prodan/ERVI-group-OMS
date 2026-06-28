import {
  Calendar,
  TrendingUp,
  EuroIcon,
} from 'lucide-react';

import { DocumentsStatCard } from './DocumentsStatCard';
import './DocumentsStats.css';

interface Props {
  selectedYear: number;
  selectedMonthName: string;

  monthlyWithDph: number;
  monthlyWithoutDph: number;
  monthlyCount: number;

  yearlyWithDph: number;
  yearlyWithoutDph: number;
  yearlyCount: number;

  grandWithDph: number;
  grandWithoutDph: number;
  grandCount: number;
}

export const DocumentsStats = ({
  selectedYear,
  selectedMonthName,

  monthlyWithDph,
  monthlyWithoutDph,
  monthlyCount,

  yearlyWithDph,
  yearlyWithoutDph,
  yearlyCount,

  grandWithDph,
  grandWithoutDph,
  grandCount,
}: Props) => {
  return (
    <div className="documents-stats">

      <DocumentsStatCard
        icon={<Calendar size={14} />}
        title={`Suma za ${selectedMonthName} ${selectedYear}`}
        value={monthlyWithDph.toLocaleString('sk-SK', {
          minimumFractionDigits: 2,
        })}
        secondaryValue={monthlyWithoutDph.toLocaleString('sk-SK', {
          minimumFractionDigits: 2,
        })}
        footerLabel="Aktuálny mesiac"
        footerCount={monthlyCount}
        accentClass="documents-stat-card__accent--blue"
      />

      <DocumentsStatCard
        icon={<TrendingUp size={14} />}
        title={`Celkovo za rok ${selectedYear}`}
        value={yearlyWithDph.toLocaleString('sk-SK', {
          minimumFractionDigits: 2,
        })}
        secondaryValue={yearlyWithoutDph.toLocaleString('sk-SK', {
          minimumFractionDigits: 2,
        })}
        footerLabel="Akumulácia za rok"
        footerCount={yearlyCount}
        accentClass="documents-stat-card__accent--green"
      />

      <DocumentsStatCard
        icon={<EuroIcon size={14} />}
        title="Celkový archív (Grand Total)"
        value={grandWithDph.toLocaleString('sk-SK', {
          minimumFractionDigits: 2,
        })}
        secondaryValue={grandWithoutDph.toLocaleString('sk-SK', {
          minimumFractionDigits: 2,
        })}
        footerLabel="Celkovo v systéme"
        footerCount={grandCount}
        accentClass="documents-stat-card__accent--indigo"
      />
    </div>
  );
};