import type { OrderStatus } from "../components/orders/types";

export const statusMap: Record<OrderStatus, { label: string; color: string }> = {
  sent: { label: 'Bude odoslané', color: '#f97316' },
  accepted: { label: 'Prijaté', color: '#16a34a' },
  cancelled: { label: 'Zrušené', color: '#dc2626' },
  paid: { label: 'Zaplatené', color: '#6b21a8' },
  delivered: { label: 'Doručené', color: '#2563eb' },
};