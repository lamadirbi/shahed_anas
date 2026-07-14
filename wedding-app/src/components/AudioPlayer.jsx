import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { AUDIO_SRC } from '../preloadAssets';

function tryPlay(audio) {
  if (!audio) return Promise.resolve();

  audio.loop = true;

  try {
    audio.currentTime = 0;
  } catch {
    /* ignore seek errors before metadata */
  }

  const playPromise = audio.play();
  if (playPromise && typeof playPromise.then === 'function') {
    return playPromise.catch(() => {
      const retry = () => {
        audio.removeEventListener('canplay', retry);
        try {
          audio.currentTime = 0;
        } catch {
          /* ignore */
        }
        audio.play().catch(() => {});
      };
      audio.addEventListener('canplay', retry, { once: true });
      try {
        audio.load();
      } catch {
        /* ignore */
      }
    });
  }

  return Promise.resolve();
}

const AudioPlayer = forwardRef(function AudioPlayer({ started }, ref) {
  const audioRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      playFromStart() {
        return tryPlay(audioRef.current);
      },
      get paused() {
        return audioRef.current?.paused ?? true;
      },
      play() {
        return audioRef.current?.play()?.catch(() => {}) ?? Promise.resolve();
      },
      pause() {
        audioRef.current?.pause();
      },
    }),
    [],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const keepLooping = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener('ended', keepLooping);
    return () => audio.removeEventListener('ended', keepLooping);
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        playsInline
      />
      {started && (
        <button className="audio-btn" onClick={toggle} aria-label="تشغيل الموسيقى">
          ♪
        </button>
      )}
    </>
  );
});

export default AudioPlayer;
