/** صور تظهر فوراً مع فتح الظرف */
export const CRITICAL_IMAGES = [
  '/images/couple-outdoor.jpg',
  '/images/groom-formal.jpg',
];

/** باقي صور الدعوة — تُحمَّل في الخلفية بعد الفتح */
export const REST_IMAGES = [
  '/images/bride.jpg',
  '/images/hands.jpg',
  '/images/car.jpg',
  '/images/photo-5.jpg',
  '/images/photo-6.jpg',
];

export const AUDIO_SRC = '/audio/song.m4a';

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(src);
    img.decoding = 'async';
    img.src = src;
  });
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]);
}

/** يبدأ تحميل الصوت دون انتظار اكتماله */
export function warmAudio() {
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = AUDIO_SRC;
  audio.load();
}

export function preloadRestImages() {
  REST_IMAGES.forEach((src) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  });
}

/**
 * يفتح الظرف بسرعة: ينتظر الصور الحرجة فقط (مع مهلة قصوى)،
 * ويبدأ تحميل الصوت وباقي الصور في الخلفية.
 */
export function preloadInvitationAssets() {
  warmAudio();
  preloadRestImages();

  return withTimeout(
    Promise.all(CRITICAL_IMAGES.map(preloadImage)),
    1800,
  );
}
