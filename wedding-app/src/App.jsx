import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroEnvelope from './components/IntroEnvelope';
import InvitationCard from './components/InvitationCard';
import AudioPlayer from './components/AudioPlayer';
import './components/AppBackground.css';

export default function App() {
  const [showInvite, setShowInvite] = useState(false);
  const [hideIntro, setHideIntro] = useState(false);
  const [started, setStarted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('invitation-open', showInvite);
    return () => document.body.classList.remove('invitation-open');
  }, [showInvite]);

  const handleLiftStart = () => {
    setStarted(true);
    setShowInvite(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 28;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleLiftEnd = () => {
    setHideIntro(true);
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
            onLiftStart={handleLiftStart}
            onLiftEnd={handleLiftEnd}
          />
        )}
      </AnimatePresence>
    </>
  );
}
