import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroEnvelope from './components/IntroEnvelope';
import InvitationCard from './components/InvitationCard';
import AudioPlayer from './components/AudioPlayer';
import { preloadInvitationAssets } from './preloadAssets';
import './components/AppBackground.css';

export default function App() {
  const [showInvite, setShowInvite] = useState(false);
  const [hideIntro, setHideIntro] = useState(false);
  const [started, setStarted] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let active = true;

    preloadInvitationAssets().then(() => {
      if (active) setAssetsReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('invitation-open', showInvite);
    return () => document.body.classList.remove('invitation-open');
  }, [showInvite]);

  const playAudio = useCallback(() => {
    // يجب استدعاء التشغيل مباشرة داخل ضغطة المستخدم (موبايل)
    audioRef.current?.playFromStart?.();
  }, []);

  const handleLiftStart = () => {
    setStarted(true);
    setShowInvite(true);
    // محاولة إضافية مباشرة بعد فتح الكرت
    audioRef.current?.playFromStart?.();
  };

  const handleLiftEnd = () => {
    setHideIntro(true);
    audioRef.current?.playFromStart?.();
  };

  return (
    <>
      <div className="app-bg" aria-hidden="true" />

      <AudioPlayer ref={audioRef} started={started} />

      {showInvite && <InvitationCard />}

      <AnimatePresence>
        {!hideIntro && (
          <IntroEnvelope
            key="intro"
            ready={assetsReady}
            onPlayAudio={playAudio}
            onLiftStart={handleLiftStart}
            onLiftEnd={handleLiftEnd}
          />
        )}
      </AnimatePresence>
    </>
  );
}
