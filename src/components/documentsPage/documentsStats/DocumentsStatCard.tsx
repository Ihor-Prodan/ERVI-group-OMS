import './DocumentsStats.css';

interface Props {
  icon: React.ReactNode;
  title: string;
  value: string;
  secondaryValue: string;
  footerLabel: string;
  footerCount: number;
  accentClass: string;
}

export const DocumentsStatCard = ({
  icon,
  title,
  value,
  secondaryValue,
  footerLabel,
  footerCount,
  accentClass,
}: Props) => {
  return (
    <div className="documents-stat-card">
      <div
        className={`documents-stat-card__accent ${accentClass}`}
      />

      <div className="documents-stat-card__content">
        <span className="documents-stat-card__title">
          {icon}
          {title}
        </span>

        <div className="documents-stat-card__value-wrapper">
          <span className="documents-stat-card__value">
            {value}
          </span>

          <span className="documents-stat-card__currency">
            € s DPH
          </span>
        </div>

        <p className="documents-stat-card__secondary">
          bez DPH:
          <span className="documents-stat-card__secondary-value">
            {secondaryValue} €
          </span>
        </p>
      </div>

      <div className="documents-stat-card__footer">
        <span>{footerLabel}</span>

        <span className="documents-stat-card__badge">
          {footerCount} ks
        </span>
      </div>
    </div>
  );
};