export const WISHES_KEY = 'wedding:wishes';
export const DELETE_TOKENS_STORAGE_KEY = 'wedding-wish-delete-tokens';

export interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  deleteToken: string;
}

export interface PublicWish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export function toPublicWish(wish: Wish): PublicWish {
  const { deleteToken: _token, ...publicWish } = wish;
  return publicWish;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function generateDeleteToken(): string {
  return crypto.randomUUID();
}

export function parseWish(raw: unknown): Wish | null {
  if (typeof raw !== 'string') return null;

  try {
    const parsed = JSON.parse(raw) as Partial<Wish>;
    if (
      typeof parsed.id === 'string' &&
      typeof parsed.name === 'string' &&
      typeof parsed.message === 'string' &&
      typeof parsed.createdAt === 'string' &&
      typeof parsed.deleteToken === 'string'
    ) {
      return parsed as Wish;
    }
  } catch {
    return null;
  }

  return null;
}

export function sanitizeName(name: string): string {
  return name.trim().slice(0, 80);
}

export function sanitizeMessage(message: string): string {
  return message.trim().slice(0, 500);
}

export function getStoredDeleteTokens(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem(DELETE_TOKENS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function storeDeleteToken(wishId: string, deleteToken: string): void {
  if (typeof window === 'undefined') return;

  const tokens = getStoredDeleteTokens();
  tokens[wishId] = deleteToken;
  localStorage.setItem(DELETE_TOKENS_STORAGE_KEY, JSON.stringify(tokens));
}

export function removeStoredDeleteToken(wishId: string): void {
  if (typeof window === 'undefined') return;

  const tokens = getStoredDeleteTokens();
  delete tokens[wishId];
  localStorage.setItem(DELETE_TOKENS_STORAGE_KEY, JSON.stringify(tokens));
}

export function canDeleteWish(wishId: string): boolean {
  return Boolean(getStoredDeleteTokens()[wishId]);
}
