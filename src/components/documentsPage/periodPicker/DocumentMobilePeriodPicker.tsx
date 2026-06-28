import { Folder, ChevronDown } from "lucide-react";
import "./documents-mobile-period-picker.css";

type Props = {
  years: number[];
  selectedYear: number;
  selectedMonthIndex: number;
  setSelectedYear: (year: number) => void;
  setSelectedMonthIndex: (month: number) => void;
  setExpandedYears: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  getDocumentCountForYear: (year: number) => number;
  getDocumentCountForMonth: (year: number, month: number) => number;
  MONTH_NAMES_SK: string[];
};

export const DocumentMobilePeriodPicker = ({
  years,
  selectedYear,
  selectedMonthIndex,
  setSelectedYear,
  setSelectedMonthIndex,
  setExpandedYears,
  getDocumentCountForYear,
  getDocumentCountForMonth,
  MONTH_NAMES_SK,
}: Props) => {
  return (
    <div className="documents-mobile-picker">
      
      <div className="documents-mobile-picker__header">
        <Folder className="documents-mobile-picker__icon" />
        <h3 className="documents-mobile-picker__title">
          Výber obdobia pre zobrazenie
        </h3>
      </div>

      <div className="documents-mobile-picker__grid">

        {/* YEAR */}
        <div className="documents-mobile-picker__field">
          <label className="documents-mobile-picker__label">Rok</label>

          <div className="documents-mobile-picker__select-wrapper">
            <select
              value={selectedYear}
              onChange={(e) => {
                const yr = parseInt(e.target.value);
                setSelectedYear(yr);
                setExpandedYears((prev) => ({ ...prev, [yr]: true }));
              }}
              className="documents-mobile-picker__select"
            >
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr} ({getDocumentCountForYear(yr)} ks)
                </option>
              ))}
            </select>

            <ChevronDown className="documents-mobile-picker__chevron" />
          </div>
        </div>

        {/* MONTH */}
        <div className="documents-mobile-picker__field">
          <label className="documents-mobile-picker__label">Mesiac</label>

          <div className="documents-mobile-picker__select-wrapper">
            <select
              value={selectedMonthIndex}
              onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value))}
              className="documents-mobile-picker__select"
            >
              {MONTH_NAMES_SK.map((name, idx) => (
                <option key={idx} value={idx}>
                  {name} ({getDocumentCountForMonth(selectedYear, idx)} ks)
                </option>
              ))}
            </select>

            <ChevronDown className="documents-mobile-picker__chevron" />
          </div>
        </div>

      </div>
    </div>
  );
};