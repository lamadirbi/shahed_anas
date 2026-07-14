import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  canDeleteWish,
  getStoredDeleteTokens,
  removeStoredDeleteToken,
  storeDeleteToken,
} from '../lib/wishes';
import { scrollReveal, scrollTransition, scrollViewport } from './scrollAnimations';
import './WishesSection.css';

/** عدد الأحرف الظاهرة قبل الاختصار */
const PREVIEW_LENGTH = 55;

function WishCard({ wish, owned, deleting, onDelete, onOpen }) {
  const isLong = wish.message.length > PREVIEW_LENGTH || wish.message.includes('\n');
  const preview = isLong
    ? `${wish.message.replace(/\s+/g, ' ').slice(0, PREVIEW_LENGTH).trim()}…`
    : wish.message;

  return (
    <li className="wishes-list__card">
      <div className="wishes-list__card-header">
        <span className="wishes-list__name font-verse">{wish.name}</span>
        {owned && (
          <button
            type="button"
            className="wishes-list__delete font-body"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(wish.id);
            }}
            disabled={deleting}
            aria-label="حذف التهنئة"
          >
            {deleting ? '...' : 'حذف'}
          </button>
        )}
      </div>

      <button
        type="button"
        className={`wishes-list__message font-verse${isLong ? ' wishes-list__message--long' : ''}`}
        onClick={() => isLong && onOpen(wish)}
        aria-label={isLong ? 'عرض الرسالة كاملة' : undefined}
      >
        <span className="wishes-list__message-text">{preview}</span>
        {isLong && <span className="wishes-list__more">اضغط للقراءة</span>}
      </button>
    </li>
  );
}

export default function WishesSection() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [wishes, setWishes] = useState([]);
  const [ownedIds, setOwnedIds] = useState(() => new Set());
  const [submitState, setSubmitState] = useState('idle');
  const [error, setError] = useState('');
  const [loadingWishes, setLoadingWishes] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [openedWish, setOpenedWish] = useState(null);

  const refreshOwnedIds = useCallback(() => {
    const tokens = getStoredDeleteTokens();
    setOwnedIds(new Set(Object.keys(tokens)));
  }, []);

  const fetchWishes = useCallback(async () => {
    try {
      const res = await fetch('/api/wishes');
      const data = await res.json();
      setWishes(data.wishes ?? []);
      refreshOwnedIds();
    } catch {
      setError('تعذّر تحميل التهاني');
    } finally {
      setLoadingWishes(false);
    }
  }, [refreshOwnedIds]);

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
        refreshOwnedIds();
        setWishes((prev) => [data.wish, ...prev]);
      }

      setName('');
      setMessage('');
      setSubmitState('success');
      setTimeout(() => setSubmitState('idle'), 3000);
    } catch {
      setSubmitState('error');
      setError('تعذّر إرسال التهنئة، حاول مرة أخرى');
    }
  }

  async function handleDelete(wishId) {
    if (!canDeleteWish(wishId)) return;
    if (!window.confirm('هل تريد حذف هذه التهنئة؟')) return;

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
      refreshOwnedIds();
      setWishes((prev) => prev.filter((wish) => wish.id !== wishId));
      if (openedWish?.id === wishId) setOpenedWish(null);
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
      <span className="wishes-section__eyebrow font-body">سجّل تهنئتك</span>
      <h3 className="wishes-section__title font-display">تهاني المعازيم</h3>
      <p className="wishes-section__subtitle font-body">
        اكتب اسمك ورسالتك الجميلة لأنس وشهد — ستُعرض هنا ليراها العرسان
      </p>
      <div className="gold-line" />

      <form className="wishes-form" onSubmit={handleSubmit}>
        <label className="wishes-form__field">
          <span className="wishes-form__label font-body">الاسم</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسمك"
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
            placeholder="اكتب تهنئتك للعرسان هنا..."
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
            تم إرسال تهنئتك بنجاح! يمكنك حذفها من نفس الجهاز لاحقاً
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
          <>
            <ul className="wishes-list__items" aria-label="قائمة التهاني">
              {wishes.map((wish) => (
                <WishCard
                  key={wish.id}
                  wish={wish}
                  owned={ownedIds.has(wish.id)}
                  deleting={deletingId === wish.id}
                  onDelete={handleDelete}
                  onOpen={setOpenedWish}
                />
              ))}
            </ul>
            {wishes.length > 3 && (
              <p className="wishes-list__hint font-body">مرّر للأسفل لرؤية المزيد</p>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {openedWish && (
          <motion.div
            className="wishes-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenedWish(null)}
            role="dialog"
            aria-modal="true"
            aria-label="رسالة التهنئة كاملة"
          >
            <motion.div
              className="wishes-modal__panel"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="wishes-modal__header">
                <h4 className="wishes-modal__name font-verse">{openedWish.name}</h4>
                <button
                  type="button"
                  className="wishes-modal__close font-body"
                  onClick={() => setOpenedWish(null)}
                  aria-label="إغلاق"
                >
                  ✕
                </button>
              </div>
              <div className="wishes-modal__body">
                <p className="wishes-modal__message font-verse">{openedWish.message}</p>
              </div>
              {ownedIds.has(openedWish.id) && (
                <button
                  type="button"
                  className="wishes-modal__delete font-body"
                  onClick={() => handleDelete(openedWish.id)}
                  disabled={deletingId === openedWish.id}
                >
                  {deletingId === openedWish.id ? 'جاري الحذف...' : 'حذف التهنئة'}
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
