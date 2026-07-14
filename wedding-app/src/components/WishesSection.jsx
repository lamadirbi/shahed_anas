import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  canDeleteWish,
  getStoredDeleteTokens,
  removeStoredDeleteToken,
  storeDeleteToken,
} from '../lib/wishes';
import { scrollReveal, scrollTransition, scrollViewport } from './scrollAnimations';
import './WishesSection.css';

export default function WishesSection() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [wishes, setWishes] = useState([]);
  const [submitState, setSubmitState] = useState('idle');
  const [error, setError] = useState('');
  const [loadingWishes, setLoadingWishes] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchWishes = useCallback(async () => {
    try {
      const res = await fetch('/api/wishes');
      const data = await res.json();
      setWishes(data.wishes ?? []);
    } catch {
      setError('تعذّر تحميل التهاني');
    } finally {
      setLoadingWishes(false);
    }
  }, []);

  useEffect(() => {
    fetchWishes();
  }, [fetchWishes]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitState('loading');
    setError('');

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitState('error');
        setError(data.error ?? 'تعذّر إرسال التهنئة');
        return;
      }

      if (data.wish && data.deleteToken) {
        storeDeleteToken(data.wish.id, data.deleteToken);
        setWishes((prev) => [data.wish, ...prev]);
      }

      setName('');
      setMessage('');
      setSubmitState('success');
      setTimeout(() => setSubmitState('idle'), 3000);
    } catch {
      setSubmitState('error');
      setError('تعذّر إرسال التهنئة، حاولي مرة أخرى');
    }
  }

  async function handleDelete(wishId) {
    const tokens = getStoredDeleteTokens();
    const deleteToken = tokens[wishId];
    if (!deleteToken) return;

    setDeletingId(wishId);
    setError('');

    try {
      const res = await fetch('/api/wishes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: wishId, deleteToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'تعذّر حذف التهنئة');
        return;
      }

      removeStoredDeleteToken(wishId);
      setWishes((prev) => prev.filter((wish) => wish.id !== wishId));
    } catch {
      setError('تعذّر حذف التهنئة');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <motion.section
      className="wishes-section"
      id="wishes"
      variants={scrollReveal}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      transition={scrollTransition(0)}
    >
      <span className="wishes-section__eyebrow font-body">سجّلي تهنئتك</span>
      <h3 className="wishes-section__title font-display">تهاني المعازيم</h3>
      <p className="wishes-section__subtitle font-body">
        اكتبي اسمك ورسالتك الجميلة لأنس وشهد — ستُعرض هنا ليراها العرسان
      </p>
      <div className="gold-line" />

      <form className="wishes-form" onSubmit={handleSubmit}>
        <label className="wishes-form__field">
          <span className="wishes-form__label font-body">الاسم</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسمك الكريم"
            maxLength={80}
            required
            className="wishes-form__input font-body"
          />
        </label>

        <label className="wishes-form__field">
          <span className="wishes-form__label font-body">رسالة التهنئة</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتبي تهنئتك للعرسان هنا..."
            maxLength={500}
            required
            rows={4}
            className="wishes-form__textarea font-verse"
          />
        </label>

        {error && <p className="wishes-form__error">{error}</p>}

        <button
          type="submit"
          className="wishes-form__submit font-body"
          disabled={submitState === 'loading'}
        >
          {submitState === 'loading' ? 'جاري الإرسال...' : 'إرسال التهنئة ♥'}
        </button>

        {submitState === 'success' && (
          <p className="wishes-form__success font-body">
            تم إرسال تهنئتك بنجاح! شكراً لمشاركتكم الفرح
          </p>
        )}
      </form>

      <div className="wishes-list">
        <h4 className="wishes-list__title font-display">التهاني</h4>

        {loadingWishes ? (
          <p className="wishes-list__empty font-body">جاري تحميل التهاني...</p>
        ) : wishes.length === 0 ? (
          <p className="wishes-list__empty font-body">كن أول من يهنّئ العرسان ♥</p>
        ) : (
          <ul className="wishes-list__items">
            {wishes.map((wish) => (
              <li key={wish.id} className="wishes-list__card">
                <div className="wishes-list__card-header">
                  <span className="wishes-list__name font-verse">{wish.name}</span>
                  {canDeleteWish(wish.id) && (
                    <button
                      type="button"
                      className="wishes-list__delete font-body"
                      onClick={() => handleDelete(wish.id)}
                      disabled={deletingId === wish.id}
                      aria-label="حذف تهنئتي"
                    >
                      {deletingId === wish.id ? '...' : 'حذف'}
                    </button>
                  )}
                </div>
                <p className="wishes-list__message font-verse">{wish.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.section>
  );
}
