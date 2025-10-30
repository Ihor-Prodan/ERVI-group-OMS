import type { OrderDetails, OrderStatus } from "../types";

export const filterOrders = (
  orders: OrderDetails[],
  filters: {
    status?: OrderStatus;
    country?: string;
    date?: string; // YYYY-MM
  }
) => {
  const normalizeCountry = (name?: string) =>
    name?.trim().toLowerCase().replace(/\s+/g, '').replace(/[^\p{L}]/gu, '') || '';

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

    return true;
  });
};
