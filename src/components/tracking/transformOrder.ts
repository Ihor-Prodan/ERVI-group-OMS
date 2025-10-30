import { formatDate } from "../../utils/dateUtils";
import { COMPANY_OPTIONS } from "../fields/companies";
import type { OrderDetails, ParcelStep } from "../orders/types";

export const transformOrderToSteps = (order: OrderDetails): ParcelStep[] => {
  const steps: ParcelStep[] = [];

  if (!order || !order.statusDates) {
    console.warn("Order object does not have statusDates:", order);
    return steps;
  }

  const companyName =
    COMPANY_OPTIONS.find((c) => c.value === order.company)?.label || order.company;

  const { accepted, sent, delivered, cancelled, paid } = order.statusDates;

  if (accepted) {
    steps.push({
      status: "accepted",
      date: formatDate(accepted),
      from: order.from,
      to: order.to,
      sender: companyName,
      receiver: order.fullname,
      parcelNumber: order.deliveryNumber,
    });
  }

  if (sent) {
    steps.push({
      status: "sent",
      date: formatDate(sent),
      from: order.from,
      to: order.to,
      sender: companyName,
      receiver: order.fullname,
      parcelNumber: order.deliveryNumber,
    });
  }

  if (delivered || paid) {
    steps.push({
      status: "delivered",
      date: formatDate(delivered || paid),
      from: order.from,
      to: order.to,
      sender: companyName,
      receiver: order.fullname,
      parcelNumber: order.deliveryNumber,
    });
  }

  if (cancelled) {
    steps.push({
      status: "cancelled",
      date: formatDate(cancelled),
      from: order.from,
      to: order.to,
      sender: companyName,
      receiver: order.fullname,
      parcelNumber: order.deliveryNumber,
    });
  }

  return steps;
};
