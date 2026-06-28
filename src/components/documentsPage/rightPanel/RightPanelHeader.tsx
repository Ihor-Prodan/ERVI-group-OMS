import { FileText } from "lucide-react";
import "./right-panel.css";

export const RightPanelHeader = ({
  selectedMonthIndex,
  selectedYear,
  monthlyDocs,
  MONTH_NAMES_SK,
}: any) => {
  return (
    <div className="rp-header">
      
      {/* LEFT */}
      <div className="rp-header-left">
        <h2 className="rp-title">
          <FileText className="rp-title-icon" />
          Zoznam: {MONTH_NAMES_SK[selectedMonthIndex]} {selectedYear}
        </h2>

        <p className="rp-subtitle">
          Vykázané dokumenty a faktúry v tomto období.
        </p>
      </div>

      {/* RIGHT */}
      <div className="rp-counter">
        <span className="rp-counter-number">
          {monthlyDocs.length}
        </span>

        <span>
          {monthlyDocs.length === 1
            ? "dokument"
            : monthlyDocs.length >= 2 && monthlyDocs.length <= 4
            ? "dokumenty"
            : "dokumentov"}
        </span>
      </div>

    </div>
  );
};