import React, { useState, useEffect } from 'react';
import type { DocumentEntry } from './types';
import DocumentsSection from './main/documentMain';
import Loader from '../../UI-elements/loader/Loader';
import { getDocuments, createDocument, deleteDocument, toggleDocumentPaid } from '../API/API';
import './DocumentsPage.css';

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDocuments()
      .then(setDocuments)
      .catch(() => setError('Nepodarilo sa načítať dokumenty. Skúste obnoviť stránku.'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddDocument = async (doc: Omit<DocumentEntry, 'id' | 'createdAt'>) => {
    const created = await createDocument(doc);
    setDocuments(prev => [...prev, created]);
  };

  const handleDeleteDocument = async (id: string) => {
    await deleteDocument(id);
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleTogglePaid = async (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    const updated = await toggleDocumentPaid(id, !doc.isPaid);
    setDocuments(prev => prev.map(d => (d.id === id ? updated : d)));
  };

  if (isLoading) return <Loader fullscreen />;

  if (error) return <div className="documents-page-error">{error}</div>;

  return (
    <div className="documents-page">
      <DocumentsSection
        documents={documents}
        onAddDocument={handleAddDocument}
        onDeleteDocument={handleDeleteDocument}
        onTogglePaidDocument={handleTogglePaid}
      />
    </div>
  );
};

export default DocumentsPage;
