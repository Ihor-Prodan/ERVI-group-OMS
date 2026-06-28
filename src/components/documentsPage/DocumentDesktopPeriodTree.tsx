import {
  Folder,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import "./documents-desktop-period-tree.css";

type Props = {
  years: number[];
  selectedYear: number;
  selectedMonthIndex: number;

  expandedYears: Record<number, boolean>;
  toggleYear: (year: number) => void;
  selectYearMonth: (year: number, month: number) => void;

  getDocumentCountForYear: (year: number) => number;
  getDocumentCountForMonth: (year: number, month: number) => number;

  MONTH_NAMES_SK: string[];
};

export const DocumentDesktopPeriodTree = ({
  years,
  selectedYear,
  selectedMonthIndex,
  expandedYears,
  toggleYear,
  selectYearMonth,
  getDocumentCountForYear,
  getDocumentCountForMonth,
  MONTH_NAMES_SK,
}: Props) => {
  return (
    <div className="documents-desktop-tree">

      {/* HEADER */}
      <h3 className="documents-desktop-tree__title">
        <Folder className="documents-desktop-tree__title-icon" />
        Obdobia dokumentov
      </h3>

      {/* TREE */}
      <div className="documents-desktop-tree__list">
        {years.map((year) => {
          const isExpanded = !!expandedYears[year];
          const yearCount = getDocumentCountForYear(year);

          return (
            <div key={year} className="documents-desktop-tree__year">

              {/* YEAR ROW */}
              <button
                onClick={() => toggleYear(year)}
                className={`documents-desktop-tree__year-row ${
                  selectedYear === year && !isExpanded
                    ? "is-active"
                    : ""
                }`}
              >
                <div className="documents-desktop-tree__year-left">

                  {isExpanded ? (
                    <ChevronDown className="documents-desktop-tree__chevron" />
                  ) : (
                    <ChevronRight className="documents-desktop-tree__chevron" />
                  )}

                  <Folder
                    className={`documents-desktop-tree__folder ${
                      selectedYear === year ? "is-selected" : ""
                    }`}
                  />

                  <span className="documents-desktop-tree__year-label">
                    {year}
                  </span>
                </div>

                {yearCount > 0 && (
                  <span className="documents-desktop-tree__count">
                    {yearCount}
                  </span>
                )}
              </button>

              {/* MONTHS */}
              {isExpanded && (
                <div className="documents-desktop-tree__months">
                  {MONTH_NAMES_SK.map((monthName, mIdx) => {
                    const monthCount = getDocumentCountForMonth(year, mIdx);
                    const isSelected =
                      selectedYear === year &&
                      selectedMonthIndex === mIdx;

                    return (
                      <button
                        key={mIdx}
                        onClick={() => selectYearMonth(year, mIdx)}
                        className={`documents-desktop-tree__month ${
                          isSelected ? "is-selected" : ""
                        }`}
                      >
                        <span>{monthName}</span>

                        {monthCount > 0 && (
                          <span className="documents-desktop-tree__month-count">
                            {monthCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};