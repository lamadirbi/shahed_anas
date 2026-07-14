export const DELETE_TOKENS_STORAGE_KEY = 'wedding-wish-delete-tokens';

export function getStoredDeleteTokens() {
  try {
    const raw = localStorage.getItem(DELETE_TOKENS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function storeDeleteToken(wishId, deleteToken) {
  const tokens = getStoredDeleteTokens();
  tokens[wishId] = deleteToken;
  localStorage.setItem(DELETE_TOKENS_STORAGE_KEY, JSON.stringify(tokens));
}

export function removeStoredDeleteToken(wishId) {
  const tokens = getStoredDeleteTokens();
  delete tokens[wishId];
  localStorage.setItem(DELETE_TOKENS_STORAGE_KEY, JSON.stringify(tokens));
}

export function canDeleteWish(wishId) {
  return Boolean(getStoredDeleteTokens()[wishId]);
}
