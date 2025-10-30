import React, { useMemo, useState } from 'react';
import './Filters.css';
import CustomDropdown from '../../../UI-elements/dropdown/Dropdown';
import type { FilterOptions, OrderDetails } from '../types';
import { statusMap } from '../../../const/const';

interface OrderFiltersProps {
  orders: OrderDetails[];
  onFilterChange: (filters: FilterOptions) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({ orders, onFilterChange }) => {
  const [filters, setFilters] = useState<FilterOptions>({});

  const countryOptions = useMemo(() => {
    const uniqueCountries = Array.from(new Set(orders.map((o) => o.receiverCountry)));

    return [
      { value: '', label: 'Všetky krajiny' },
      ...uniqueCountries.map((c) => ({ value: c, label: c })),
    ];
  }, [orders]);

  const statusOptions = useMemo(() => {
    return [
      { value: '', label: 'Všetky stavy' },
      ...Object.entries(statusMap).map(([key, val]) => ({
        value: key,
        label: val.label,
      })),
    ];
  }, []);

  const dateOptions = useMemo(() => {
    const uniqueMonths = Array.from(
      new Set(
        orders
          .map(
            (o) =>
              o.statusDates.accepted && new Date(o.statusDates.accepted).toISOString().slice(0, 7)
          )
          .filter(Boolean)
      )
    );

    return [
      { value: '', label: 'Všetky mesiace' },
      ...uniqueMonths.map((m) => ({ value: m!, label: m! })),
    ];
  }, [orders]);

  const handleChange = (field: keyof FilterOptions, value: string | number) => {
    const newFilters = { ...filters, [field]: value || undefined };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filters-container">
      <CustomDropdown
        label="Krajina"
        options={countryOptions}
        value={filters.country || ''}
        onChange={(v) => handleChange('country', v)}
      />

      <CustomDropdown
        label="Stav objednávky"
        options={statusOptions}
        value={filters.status || ''}
        onChange={(v) => handleChange('status', v)}
      />

      <CustomDropdown
        label="Mesiac"
        options={dateOptions}
        value={filters.date || ''}
        onChange={(v) => handleChange('date', v)}
      />
    </div>
  );
};

export default OrderFilters;
