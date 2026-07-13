import { motion } from 'framer-motion';
import './SlideScene.css';

export default function OutdoorSlide({ onContinue }) {
  return (
    <motion.div
      className="scene slide-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div
        className="slide-bg kenburns"
        style={{ backgroundImage: 'url(/images/couple-outdoor.jpg)' }}
      />
      <div className="slide-overlay slide-overlay-soft" />
      <div className="ornate-frame" />

      <motion.div
        className="slide-content"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.9 }}
      >
        <p className="slide-verse font-amiri">قصة حب بدأت بالدعاء</p>
        <div className="gold-line" />
        <h2 className="slide-couple font-rakkas">أنس &amp; شهد</h2>
        <p className="slide-sub font-cairo">لحظات جميلة في رحلة العمر</p>
      </motion.div>

      <button className="slide-skip font-cairo" onClick={onContinue}>
        شوفي الدعوة ←
      </button>
    </motion.div>
  );
}
