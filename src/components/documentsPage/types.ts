export type DocumentCategory = 'faktura' | 'priloha';

export interface DocumentEntry {
  id: string;
  name: string;
  fileUrl: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  category: DocumentCategory;
  sumWithDph: number;
  sumWithoutDph: number;
  dphRate: number;
  date: string;
  dueDate?: string;
  isPaid?: boolean;
  visibleToAccountant?: boolean;
  note?: string;
  createdAt: string;
}
