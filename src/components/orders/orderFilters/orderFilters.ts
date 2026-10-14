import type { OrderDetails, OrderStatus } from "../types";

const SEARCHABLE_FIELDS: (keyof OrderDetails)[] = [
  'deliveryNumber',
  'contractNumber',
  'company',
  'fullname',
  'email',
  'phone',
  'street',
  'city',
  'psc',
  'country',
  'from',
  'to',
  'receiverEmail',
  'receiverPhone',
  'receiverStreet',
  'receiverCity',
  'receiverPsc',
  'receiverCountry',
];

export const filterOrders = (
  orders: OrderDetails[],
  filters: {
    status?: OrderStatus;
    country?: string;
    date?: string; // YYYY-MM
    search?: string;
  }
) => {
  const normalizeCountry = (name?: string) =>
    name?.trim().toLowerCase().replace(/\s+/g, '').replace(/[^\p{L}]/gu, '') || '';

  const normalizeSearch = (value?: string) => value?.trim().toLowerCase() || '';

  return orders.filter((o) => {
    if (filters.status && o.status !== filters.status) {
      return false;
    };

    if (filters.country) {
      const orderCountry = normalizeCountry(o.receiverCountry);
      const filterCountry = normalizeCountry(filters.country);

      if (orderCountry !== filterCountry) {
        return false;
      };
    }

    if (filters.date) {
      const orderDate = o.statusDates.accepted ? new Date(o.statusDates.accepted) : null;
      if (!orderDate) {
        return false
      };

      const orderMonth = orderDate.toISOString().slice(0, 7);
      
      if (orderMonth !== filters.date) {
        return false
      };
    }

    if (filters.search) {
      const term = normalizeSearch(filters.search);
      const matches = SEARCHABLE_FIELDS.some((field) =>
        String(o[field] ?? '').toLowerCase().includes(term)
      );

      if (!matches) {
        return false;
      }
    }

    return true;
  });
};
