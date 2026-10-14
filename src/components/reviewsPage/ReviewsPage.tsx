import React, { useEffect, useState } from 'react';
import { Check, Star, Trash2, X } from 'lucide-react';
import { getAllReviews, setReviewApproved, deleteReview, type Review } from '../API/API';
import ConfirmModal from '../comfirmModal/ComfirmModal';
import './ReviewsPage.css';

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getAllReviews()
      .then(setReviews)
      .finally(() => setIsLoading(false));
  }, []);

  const handleToggleApproved = async (id: string, approved: boolean) => {
    try {
      const updated = await setReviewApproved(id, approved);
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err: any) {
      alert(err.message || 'Nepodarilo sa zmeniť stav recenzie.');
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmId) return;
    setIsDeleting(true);
    try {
      await deleteReview(confirmId);
      setReviews((prev) => prev.filter((r) => r.id !== confirmId));
      setConfirmId(null);
    } catch (err: any) {
      alert(err.message || 'Nepodarilo sa zmazať recenziu.');
    } finally {
      setIsDeleting(false);
    }
  };

  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  const renderCard = (r: Review) => (
    <div key={r.id} className="reviews-card">
      <div className="reviews-card-header">
        <div>
          <span className="reviews-card-name">{r.name}</span>
          {r.company && <span className="reviews-card-company"> · {r.company}</span>}
        </div>
        <div className="reviews-card-stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} fill={i < r.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
          ))}
        </div>
      </div>
      <p className="reviews-card-message">{r.message}</p>
      <div className="reviews-card-footer">
        <span className="reviews-card-date">
          {new Date(r.createdAt).toLocaleDateString('sk-SK')}
        </span>
        <div className="reviews-card-actions">
          {r.approved ? (
            <button
              className="reviews-action-btn reviews-action-btn--reject"
              onClick={() => handleToggleApproved(r.id, false)}
              title="Skryť z verejného webu"
            >
              <X size={14} /> Skryť
            </button>
          ) : (
            <button
              className="reviews-action-btn reviews-action-btn--approve"
              onClick={() => handleToggleApproved(r.id, true)}
              title="Zverejniť na webe"
            >
              <Check size={14} /> Schváliť
            </button>
          )}
          <button
            className="reviews-delete-btn"
            onClick={() => setConfirmId(r.id)}
            title="Zmazať recenziu"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h1 className="reviews-title">Recenzie</h1>
        <p className="reviews-subtitle">Moderácia recenzií zákazníkov z webu</p>
      </div>

      {isLoading ? (
        <p className="reviews-loading">Načítava sa...</p>
      ) : reviews.length === 0 ? (
        <p className="reviews-loading">Zatiaľ žiadne recenzie.</p>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="reviews-section">
              <h2 className="reviews-section-title">Čakajú na schválenie ({pending.length})</h2>
              <div className="reviews-list">{pending.map(renderCard)}</div>
            </div>
          )}

          <div className="reviews-section">
            <h2 className="reviews-section-title">Zverejnené ({approved.length})</h2>
            {approved.length === 0 ? (
              <p className="reviews-loading">Zatiaľ žiadne zverejnené recenzie.</p>
            ) : (
              <div className="reviews-list">{approved.map(renderCard)}</div>
            )}
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={!!confirmId}
        title="Zmazať recenziu"
        message="Naozaj chcete zmazať túto recenziu? Táto akcia je nevratná."
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmId(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ReviewsPage;
