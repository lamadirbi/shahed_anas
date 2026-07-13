import { motion } from 'framer-motion';
import './SlideScene.css';

export default function GroomSlide({ onContinue }) {
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
        style={{ backgroundImage: 'url(/images/groom-formal.jpg)' }}
      />
      <div className="slide-overlay" />
      <div className="ornate-frame" />

      <motion.div
        className="slide-content"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.9 }}
      >
        <span className="slide-badge font-cairo">تعريس العريس</span>
        <h1 className="slide-title font-rakkas">شيخ الشباب عريسنا</h1>
        <div className="gold-line" />
        <h2 className="slide-name font-amiri">المحاسب أنس معين حنيف</h2>
        <p className="slide-parent font-cairo">ابن السيد معين حمزة حنيف</p>
      </motion.div>

      <button className="slide-skip font-cairo" onClick={onContinue}>
        متابعة ←
      </button>
    </motion.div>
  );
}
