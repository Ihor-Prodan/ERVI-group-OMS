export type OrderStatus = 'sent' | 'accepted' | 'cancelled' | 'delivered' | 'paid';

export type FilterOptions = {
  status?: OrderStatus;
  country?: string;
  date?: string;
}

export type OrderDetails = {
  id: string;
  company: string;
  deliveryNumber: string;
  street: string;
  psc: string;
  city: string;
  email: string;
  phone: string;
  country: string;
  date: string;
  status: OrderStatus;
  statusDates: {
    sent?: string | null;
    accepted?: string;
    cancelled?: string | null;
    delivered?: string | null;
    paid?: string | null;
  };
  from: string;
  to: string;
  deliveryNote: string;
  contractNumber: string;
  services: string[];
  gdpr: boolean;
  products: string[];
  weight: string;
  pickupType: 'date' | 'asap';
  pickupDate?: string | null;
  fullname: string;
  receiverStreet: string;
  receiverPsc: string;
  receiverCity: string;
  receiverCountry: string;
  receiverPhone: string;
  receiverEmail: string;
}

export type ParcelStatus = 'accepted' | 'sent' | 'delivered' | 'cancelled';

export interface ParcelStep {
  status: ParcelStatus;
  date: string;
  from: string;
  to: string;
  sender: string;
  receiver: string;
  parcelNumber: string;
}

export type FormValues = {
  // ODOSIELATEĽ
  productName: string;
  weight: string;
  company: string;
  street: string;
  psc: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  pickupType: string;
  pickupDate: string | Date;
  contractNumber: string;
  services: string[];
  gdpr: boolean;
  note: string;
  // PRÍJEMCA
  receiverName: string;
  receiverStreet: string;
  receiverPsc: string;
  receiverCity: string;
  receiverCountry: string;
  receiverPhone: string;
  receiverEmail: string;
};

