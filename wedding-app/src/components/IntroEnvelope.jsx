import { useState } from 'react';
import { motion } from 'framer-motion';
import './IntroEnvelope.css';

export default function IntroEnvelope({ ready, onPlayAudio, onLiftStart, onLiftEnd }) {
  const [lifting, setLifting] = useState(false);

  const handleOpen = () => {
    if (lifting || !ready) return;
    onPlayAudio?.();
    setLifting(true);
    onLiftStart();
    setTimeout(onLiftEnd, 1300);
  };

  return (
    <motion.div
      className="intro-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="envelope-sheet"
        initial={{ y: 0 }}
        animate={lifting ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 1.15, ease: [0.32, 0.72, 0, 1] }}
      >
        {/* نسيج الورقة */}
        <div className="envelope-sheet__texture" aria-hidden="true" />

        {/* جسم الظرف — الطيات الأربع */}
        <div className="envelope-flap envelope-flap--body" aria-hidden="true" />
        <div className="envelope-flap envelope-flap--left" aria-hidden="true" />
        <div className="envelope-flap envelope-flap--right" aria-hidden="true" />
        <div className="envelope-flap envelope-flap--bottom" aria-hidden="true" />
        <div className="envelope-flap envelope-flap--top" aria-hidden="true" />

        {/* خطوط الطي */}
        <div className="envelope-crease envelope-crease--left" aria-hidden="true" />
        <div className="envelope-crease envelope-crease--right" aria-hidden="true" />
        <div className="envelope-crease envelope-crease--bottom" aria-hidden="true" />

        {/* الختم — نقطة التقاء الطيات */}
        <div className="envelope-seal-anchor">
          <motion.button
            className="envelope-seal"
            onClick={handleOpen}
            disabled={!ready}
            aria-label="افتحي دعوة أنس وشهد"
            type="button"
            animate={
              lifting
                ? { opacity: 0, scale: 0.75 }
                : ready
                  ? { scale: [1, 1.045, 1] }
                  : { opacity: 0.75, scale: 1 }
            }
            transition={
              lifting
                ? { duration: 0.25 }
                : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <span className="envelope-seal__wax">
              <span className="envelope-seal__inner">
                <span className="envelope-seal__ring" aria-hidden="true" />
                <span className="envelope-seal__monogram font-display" aria-hidden="true">
                  أ<span className="envelope-seal__dot">·</span>ش
                </span>
                <span className="envelope-seal__label font-body" aria-hidden="true">دعوة</span>
              </span>
            </span>
          </motion.button>
        </div>
      </motion.div>

      {!lifting && (
        <motion.p
          className="intro-hint font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {ready ? 'اضغطي على الختم لفتح الدعوة' : 'جاري تحميل الصور والموسيقى...'}
        </motion.p>
      )}
    </motion.div>
  );
}
