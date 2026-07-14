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

async function readWishes(): Promise<Wish[]> {
  return withRedis(async (redis) => {
    const raw = await redis.lRange(WISHES_KEY, 0, -1);
    if (!Array.isArray(raw)) return [];

    return raw
      .map(parseWish)
      .filter((wish): wish is Wish => wish !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    if (!redisConfigured()) {
      return res.status(200).json({ wishes: [], error: 'التخزين غير مُعدّ بعد' });
    }

    try {
      const wishes = await readWishes();
      return res.status(200).json({ wishes: wishes.map(toPublicWish) });
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
      };
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

      await withRedis(async (redis) => {
        await redis.lPush(WISHES_KEY, JSON.stringify(wish));
      });

      return res.status(200).json({
        wish: toPublicWish(wish),
        deleteToken: wish.deleteToken,
      });
    } catch {
      return res.status(500).json({ error: 'تعذّر إرسال التهنئة' });
    }
  }

  if (req.method === 'DELETE') {
    if (!redisConfigured()) {
      return res.status(503).json({ error: 'التخزين غير مُعدّ بعد' });
    }

    try {
      const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as {
        id?: string;
        deleteToken?: string;
      };
      const id = body.id?.trim();
      const deleteToken = body.deleteToken?.trim();

      if (!id || !deleteToken) {
        return res.status(400).json({ error: 'بيانات الحذف غير مكتملة' });
      }

      const wishes = await readWishes();
      const target = wishes.find((wish) => wish.id === id);

      if (!target) {
        return res.status(404).json({ error: 'التّهنئة غير موجودة' });
      }

      if (target.deleteToken !== deleteToken) {
        return res.status(403).json({ error: 'غير مسموح بحذف هذه التهنئة' });
      }

      const remaining = wishes.filter((wish) => wish.id !== id);

      await withRedis(async (redis) => {
        await redis.del(WISHES_KEY);
        if (remaining.length > 0) {
          await redis.lPush(
            WISHES_KEY,
            ...remaining.map((wish) => JSON.stringify(wish)).reverse(),
          );
        }
      });

      return res.status(200).json({ success: true });
    } catch {
      return res.status(500).json({ error: 'تعذّر حذف التهنئة' });
    }
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
