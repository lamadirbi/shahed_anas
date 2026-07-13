import { forwardRef, useImperativeHandle, useRef } from 'react';

const AudioPlayer = forwardRef(function AudioPlayer({ started }, ref) {
  const audioRef = useRef(null);

  useImperativeHandle(ref, () => audioRef.current);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      if (!started) a.currentTime = 28;
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio/song.mp4" type="audio/mp4" />
      </audio>
      {started && (
        <button className="audio-btn" onClick={toggle} aria-label="تشغيل الموسيقى">
          ♪
        </button>
      )}
    </>
  );
});

export default AudioPlayer;
