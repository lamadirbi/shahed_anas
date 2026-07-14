import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import {
  WISHES_KEY,
  generateDeleteToken,
  generateId,
  parseWish,
  sanitizeMessage,
  sanitizeName,
  toPublicWish,
  type Wish,
} from '@/lib/wishes';

function kvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function readWishes(): Promise<Wish[]> {
  const raw = await kv.lrange(WISHES_KEY, 0, -1);
  if (!Array.isArray(raw)) return [];

  return raw
    .map(parseWish)
    .filter((wish): wish is Wish => wish !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function GET() {
  if (!kvConfigured()) {
    return NextResponse.json({ wishes: [], error: 'التخزين غير مُعدّ بعد' });
  }

  try {
    const wishes = await readWishes();
    return NextResponse.json({ wishes: wishes.map(toPublicWish) });
  } catch {
    return NextResponse.json({ error: 'تعذّر جلب التهاني' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!kvConfigured()) {
    return NextResponse.json({ error: 'التخزين غير مُعدّ بعد' }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { name?: string; message?: string };
    const name = sanitizeName(body.name ?? '');
    const message = sanitizeMessage(body.message ?? '');

    if (!name) {
      return NextResponse.json({ error: 'الرجاء إدخال الاسم' }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({ error: 'الرجاء كتابة رسالة التهنئة' }, { status: 400 });
    }

    const wish: Wish = {
      id: generateId(),
      name,
      message,
      createdAt: new Date().toISOString(),
      deleteToken: generateDeleteToken(),
    };

    await kv.lpush(WISHES_KEY, JSON.stringify(wish));

    return NextResponse.json({
      wish: toPublicWish(wish),
      deleteToken: wish.deleteToken,
    });
  } catch {
    return NextResponse.json({ error: 'تعذّر إرسال التهنئة' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!kvConfigured()) {
    return NextResponse.json({ error: 'التخزين غير مُعدّ بعد' }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { id?: string; deleteToken?: string };
    const id = body.id?.trim();
    const deleteToken = body.deleteToken?.trim();

    if (!id || !deleteToken) {
      return NextResponse.json({ error: 'بيانات الحذف غير مكتملة' }, { status: 400 });
    }

    const wishes = await readWishes();
    const target = wishes.find((wish) => wish.id === id);

    if (!target) {
      return NextResponse.json({ error: 'التّهنئة غير موجودة' }, { status: 404 });
    }

    if (target.deleteToken !== deleteToken) {
      return NextResponse.json({ error: 'غير مسموح بحذف هذه التهنئة' }, { status: 403 });
    }

    const remaining = wishes.filter((wish) => wish.id !== id);

    await kv.del(WISHES_KEY);
    if (remaining.length > 0) {
      await kv.lpush(
        WISHES_KEY,
        ...remaining.map((wish) => JSON.stringify(wish)).reverse(),
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'تعذّر حذف التهنئة' }, { status: 500 });
  }
}
