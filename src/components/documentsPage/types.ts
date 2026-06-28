export interface DocumentEntry {
  id: string;
  name: string;
  // file server fields
  fileUrl: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  // accounting
  sumWithDph: number;
  sumWithoutDph: number;
  dphRate: number;
  date: string;
  dueDate?: string;
  isPaid?: boolean;
  note?: string;
  createdAt: string;
}
