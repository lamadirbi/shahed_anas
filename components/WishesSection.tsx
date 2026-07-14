'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  canDeleteWish,
  getStoredDeleteTokens,
  removeStoredDeleteToken,
  storeDeleteToken,
  type PublicWish,
} from '@/lib/wishes';
import styles from './WishesSection.module.css';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export default function WishesSection() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [wishes, setWishes] = useState<PublicWish[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [error, setError] = useState('');
  const [loadingWishes, setLoadingWishes] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchWishes = useCallback(async () => {
    try {
      const res = await fetch('/api/wishes');
      const data = (await res.json()) as { wishes?: PublicWish[] };
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitState('loading');
    setError('');

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });

      const data = (await res.json()) as {
        wish?: PublicWish;
        deleteToken?: string;
        error?: string;
      };

      if (!res.ok) {
        setSubmitState('error');
        setError(data.error ?? 'تعذّر إرسال التهنئة');
        return;
      }

      if (data.wish && data.deleteToken) {
        storeDeleteToken(data.wish.id, data.deleteToken);
        setWishes((prev) => [data.wish!, ...prev]);
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

  async function handleDelete(wishId: string) {
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

      const data = (await res.json()) as { error?: string };

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
    <section className={styles.section} id="wishes">
      <div className={styles.header}>
        <span className={styles.eyebrow}>سجّلي تهنئتك</span>
        <h2 className={`${styles.title} font-amiri`}>تهاني المعازيم</h2>
        <p className={styles.subtitle}>
          اكتبي اسمك ورسالتك الجميلة لأنس وشهد — ستُعرض هنا ليراها العرسان
        </p>
        <div className={styles.goldLine} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>الاسم</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسمك الكريم"
            maxLength={80}
            required
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>رسالة التهنئة</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتبي تهنئتك للعرسان هنا..."
            maxLength={500}
            required
            rows={4}
            className={`${styles.textarea} font-amiri`}
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitState === 'loading'}
        >
          {submitState === 'loading' ? 'جاري الإرسال...' : 'إرسال التهنئة ♥'}
        </button>

        {submitState === 'success' && (
          <p className={styles.success}>تم إرسال تهنئتك بنجاح! شكراً لمشاركتكم الفرح</p>
        )}
      </form>

      <div className={styles.listWrap}>
        <h3 className={`${styles.listTitle} font-amiri`}>التهاني</h3>

        {loadingWishes ? (
          <p className={styles.empty}>جاري تحميل التهاني...</p>
        ) : wishes.length === 0 ? (
          <p className={styles.empty}>كن أول من يهنّئ العرسان ♥</p>
        ) : (
          <ul className={styles.list}>
            {wishes.map((wish) => (
              <li key={wish.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={`${styles.cardName} font-amiri`}>{wish.name}</span>
                  {canDeleteWish(wish.id) && (
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(wish.id)}
                      disabled={deletingId === wish.id}
                      aria-label="حذف تهنئتي"
                    >
                      {deletingId === wish.id ? '...' : 'حذف'}
                    </button>
                  )}
                </div>
                <p className={`${styles.cardMessage} font-amiri`}>{wish.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
