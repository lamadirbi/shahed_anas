export const INVITATION_IMAGES = [
  '/images/groom-formal.jpg',
  '/images/bride.jpg',
  '/images/hands.jpg',
  '/images/couple-outdoor.jpg',
  '/images/car.jpg',
  '/images/photo-5.jpg',
  '/images/photo-6.jpg',
];

const AUDIO_SRC = '/audio/song.mp4';

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

function preloadAudio() {
  return new Promise((resolve) => {
    const audio = new Audio();
    const done = () => resolve(AUDIO_SRC);

    audio.addEventListener('canplaythrough', done, { once: true });
    audio.addEventListener('error', done, { once: true });
    audio.preload = 'auto';
    audio.src = AUDIO_SRC;
    audio.load();
  });
}

export function preloadInvitationAssets() {
  return Promise.all([...INVITATION_IMAGES.map(preloadImage), preloadAudio()]);
}
