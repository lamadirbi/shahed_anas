import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  WISHES_KEY,
  generateDeleteToken,
  generateId,
  parseWish,
  sanitizeMessage,
  sanitizeName,
  toPublicWish,
  type Wish,
} from '../lib/wishes';
import { redisConfigured, withRedis } from '../lib/redis';

/** قائمة دائمة — لا تُحذف أبداً */
export const WISHES_ARCHIVE_KEY = 'wedding:wishes:archive';

async function readList(key: string): Promise<Wish[]> {
  return withRedis(async (redis) => {
    const raw = await redis.lRange(key, 0, -1);
    if (!Array.isArray(raw)) return [];

    return raw
      .map(parseWish)
      .filter((wish): wish is Wish => wish !== null);
  });
}

/** يجمع التهاني من القائمة الأساسية + الأرشيف بدون تكرار */
async function readAllWishes(): Promise<Wish[]> {
  const [main, archive] = await Promise.all([
    readList(WISHES_KEY),
    readList(WISHES_ARCHIVE_KEY),
  ]);

  const byId = new Map<string, Wish>();
  for (const wish of [...archive, ...main]) {
    byId.set(wish.id, wish);
  }

  return [...byId.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

async function saveWishForever(wish: Wish): Promise<void> {
  const payload = JSON.stringify(wish);
  await withRedis(async (redis) => {
    // الأرشيف أولاً (دائم) ثم القائمة الظاهرة — بدون أي DEL أبداً
    await redis.lPush(WISHES_ARCHIVE_KEY, payload);
    await redis.lPush(WISHES_KEY, payload);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    if (!redisConfigured()) {
      return res.status(200).json({ wishes: [], error: 'التخزين غير مُعدّ بعد' });
    }

    try {
      const wishes = await readAllWishes();
      return res.status(200).json({
        wishes: wishes.map(toPublicWish),
        count: wishes.length,
      });
    } catch {
      return res.status(500).json({ error: 'تعذّر جلب التهاني' });
    }
  }

  if (req.method === 'POST') {
    if (!redisConfigured()) {
      return res.status(503).json({ error: 'التخزين غير مُعدّ بعد' });
    }

    try {
      const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as {
        name?: string;
        message?: string;
        /** استرجاع دفعة تهاني مفقودة — يحتاج رمز الإدارة */
        restore?: Array<{ name: string; message: string; createdAt?: string }>;
        adminKey?: string;
      };

      // استرجاع يدوي لدفعة تهاني (لو عندك نصوصها)
      if (Array.isArray(body.restore)) {
        if (!process.env.WISHES_ADMIN_KEY || body.adminKey !== process.env.WISHES_ADMIN_KEY) {
          return res.status(403).json({ error: 'غير مصرح بالاسترجاع' });
        }

        const saved: Wish[] = [];
        for (const item of body.restore) {
          const name = sanitizeName(item.name ?? '');
          const message = sanitizeMessage(item.message ?? '');
          if (!name || !message) continue;

          const wish: Wish = {
            id: generateId(),
            name,
            message,
            createdAt: item.createdAt && !Number.isNaN(Date.parse(item.createdAt))
              ? new Date(item.createdAt).toISOString()
              : new Date().toISOString(),
            deleteToken: generateDeleteToken(),
          };
          await saveWishForever(wish);
          saved.push(wish);
        }

        return res.status(200).json({
          restored: saved.length,
          wishes: saved.map(toPublicWish),
        });
      }

      const name = sanitizeName(body.name ?? '');
      const message = sanitizeMessage(body.message ?? '');

      if (!name) {
        return res.status(400).json({ error: 'الرجاء إدخال الاسم' });
      }

      if (!message) {
        return res.status(400).json({ error: 'الرجاء كتابة رسالة التهنئة' });
      }

      const wish: Wish = {
        id: generateId(),
        name,
        message,
        createdAt: new Date().toISOString(),
        deleteToken: generateDeleteToken(),
      };

      await saveWishForever(wish);

      return res.status(200).json({
        wish: toPublicWish(wish),
        deleteToken: wish.deleteToken,
      });
    } catch {
      return res.status(500).json({ error: 'تعذّر إرسال التهنئة' });
    }
  }

  // تم تعطيل الحذف حتى لا تختفي التهاني أبداً
  if (req.method === 'DELETE') {
    return res.status(403).json({
      error: 'لا يمكن حذف التهاني — تبقى محفوظة دائماً',
    });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
