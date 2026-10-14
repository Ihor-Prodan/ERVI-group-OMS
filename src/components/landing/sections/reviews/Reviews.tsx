import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { getApprovedReviews, submitReview, type Review } from '../../../API/API';
import CustomCheckbox from '../../../../UI-elements/checkBox/CustomCheckBox';
import './Reviews.css';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    company: '',
    rating: 5,
    message: '',
    honeypot: '',
    gdprConsent: false,
  });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewNotice, setReviewNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    getApprovedReviews()
      .then(setReviews)
      .catch(() => {});
  }, []);

  const reviewsSwiperRef = useRef<SwiperType | null>(null);

  const handleReviewChange = (field: 'name' | 'company' | 'message' | 'honeypot') => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setReviewForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (reviewForm.honeypot.trim() !== '') {
      return;
    }

    if (!reviewForm.name.trim() || !reviewForm.message.trim()) {
      setReviewNotice({ type: 'error', text: 'Vyplňte meno a text recenzie.' });
      return;
    }

    if (!reviewForm.gdprConsent) {
      setReviewNotice({ type: 'error', text: 'Musíte súhlasiť so zverejnením mena a firmy.' });
      return;
    }

    setReviewLoading(true);
    setReviewNotice(null);

    try {
      const res = await submitReview(reviewForm);
      setReviewNotice({ type: 'success', text: res.message });
      setReviewForm({ name: '', company: '', rating: 5, message: '', honeypot: '', gdprConsent: false });
    } catch (err: any) {
      setReviewNotice({ type: 'error', text: err.message || 'Recenziu sa nepodarilo odoslať.' });
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <section id="recenzie" className="landing__section landing__section--light">
      <div className="landing__eyebrow">RECENZIE</div>
      <h2 className="landing__title landing__title--dark">ČO O NÁS HOVORIA KLIENTI</h2>
      <p className="landing__lead">
        Skutočné skúsenosti firiem, ktorým sme doviezli to, čo iní odmietli.
      </p>

      {reviews.length > 0 && (
        <div className="landing__reviews-carousel">
          <button
            type="button"
            className="landing__carousel-arrow landing__carousel-arrow--prev"
            onClick={() => reviewsSwiperRef.current?.slidePrev()}
            aria-label="Predchádzajúce recenzie"
          >
            <ChevronLeft size={20} />
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={(swiper) => {
              reviewsSwiperRef.current = swiper;
            }}
            spaceBetween={24}
            slidesPerView={1}
            loop={reviews.length > 3}
            autoplay={reviews.length > 3 ? { delay: 5000, disableOnInteraction: false } : false}
            breakpoints={{
              600: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
            }}
            className="landing__reviews-swiper"
          >
            {reviews.map((r) => (
              <SwiperSlide key={r.id}>
                <div className="landing__card landing__review-card">
                  <div className="landing__review-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < r.rating ? 'is-filled' : ''}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="landing__review-message">„{r.message}“</p>
                  <div className="landing__review-author">
                    <strong>{r.name}</strong>
                    {r.company && <span> · {r.company}</span>}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            className="landing__carousel-arrow landing__carousel-arrow--next"
            onClick={() => reviewsSwiperRef.current?.slideNext()}
            aria-label="Ďalšie recenzie"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <div className="landing__review-form-wrap">
        <h3 className="landing__review-form-title">Máte skúsenosť s nami? Podeľte sa o ňu.</h3>
        <form className="landing__review-form" onSubmit={handleReviewSubmit}>
          <div className="landing__form-row">
            <input
              type="text"
              placeholder="Meno a priezvisko *"
              value={reviewForm.name}
              onChange={handleReviewChange('name')}
              required
            />
            <input
              type="text"
              placeholder="Firma (nepovinné)"
              value={reviewForm.company}
              onChange={handleReviewChange('company')}
            />
          </div>

          <div className="landing__review-rating-picker">
            <span>Hodnotenie:</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                type="button"
                key={i}
                className={i < reviewForm.rating ? 'is-filled' : ''}
                onClick={() => setReviewForm((prev) => ({ ...prev, rating: i + 1 }))}
                aria-label={`${i + 1} hviezdičiek`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            placeholder="Vaša recenzia *"
            rows={3}
            value={reviewForm.message}
            onChange={handleReviewChange('message')}
            required
          />
          <input
            type="text"
            name="website"
            value={reviewForm.honeypot}
            onChange={handleReviewChange('honeypot')}
            tabIndex={-1}
            autoComplete="off"
            className="landing__form-honeypot"
          />

          <CustomCheckbox
            label={
              <>
                Súhlasím, že moje meno a názov firmy budú po schválení zverejnené na webe, podľa{' '}
                <Link to="/ochrana-osobnych-udajov" className="gdpr-link" target="_blank">
                  zásad ochrany osobných údajov
                </Link>
                .
              </>
            }
            checked={reviewForm.gdprConsent}
            onChange={(checked) => setReviewForm((prev) => ({ ...prev, gdprConsent: checked }))}
          />

          {reviewNotice && (
            <div className={`landing__form-notice landing__form-notice--${reviewNotice.type}`}>
              {reviewNotice.text}
            </div>
          )}

          <button type="submit" className="landing__review-submit" disabled={reviewLoading}>
            {reviewLoading ? 'Odosielam...' : 'Odoslať recenziu'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Reviews;
