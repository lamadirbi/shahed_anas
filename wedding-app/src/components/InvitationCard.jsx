import { motion } from 'framer-motion';
import Countdown from './Countdown';
import EventDetails from './EventDetails';
import { PhotoGroomHero, PhotoPair, PhotoSingle } from './PhotoGallery';
import { Reveal, scrollReveal, scrollTransition, scrollViewport } from './scrollAnimations';
import './InvitationCard.css';

function Ornament({ size = 'md' }) {
  return (
    <div className={`ornament ornament--${size}`} aria-hidden="true">
      <span className="ornament__diamond" />
      <span className="ornament__line" />
      <span className="ornament__diamond" />
    </div>
  );
}

function SectionBreak({ label, delay = 0 }) {
  return (
    <Reveal className="section-break" delay={delay} aria-hidden="true">
      <span className="section-break__line" />
      {label && <span className="section-break__label font-body">{label}</span>}
      <span className="section-break__line" />
    </Reveal>
  );
}

function LuxeCard({ children, className = '', delay = 0, variant = 'default' }) {
  return (
    <motion.section
      className={`luxe-card luxe-card--${variant} ${className}`}
      variants={scrollReveal}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      transition={scrollTransition(delay)}
    >
      <span className="luxe-card__corner luxe-card__corner--tl" />
      <span className="luxe-card__corner luxe-card__corner--tr" />
      <span className="luxe-card__corner luxe-card__corner--bl" />
      <span className="luxe-card__corner luxe-card__corner--br" />
      {children}
    </motion.section>
  );
}

export default function InvitationCard() {
  return (
    <div className="invitation-page">
      <div className="page-wrapper">
        <div className="page-texture" aria-hidden="true" />
        <div className="page-border" aria-hidden="true" />
        <div className="page-rail" aria-hidden="true" />

        <main className="main-content main-content--hero-first">
          {/* ١ — غلاف العريس + العنوان */}
          <PhotoGroomHero
            src="/images/groom-formal.jpg"
            title="أفراح آل حنيف وآل قشطة"
            caption="عريسنا زين الشباب"
            position="center 38%"
            delay={0}
          />

          <SectionBreak label="الدعوة" delay={0.05} />

          {/* ٣ — العائلتان */}
          <LuxeCard delay={0}>
            <span className="card__eyebrow font-body">يتشرف كل من</span>
            <div className="gold-line" />
            <div className="parents-row">
              <p className="parents-row__name font-verse">السيد معين حمزة حنيف</p>
              <span className="parents-row__gem" aria-hidden="true" />
              <p className="parents-row__name font-verse">الحاج محمد صلاح قشطة</p>
            </div>
          </LuxeCard>

          {/* ٤ — أسماء العروسين */}
          <LuxeCard variant="hero" delay={0}>
            <span className="card__eyebrow font-body">لحضور حفل زفاف</span>
            <div className="gold-line gold-line--wide" />
            <div className="couple-row">
              <div className="couple-row__side">
                <span className="couple-row__tag font-body">المحاسب</span>
                <p className="couple-row__name">أنس معين حنيف</p>
              </div>
              <span className="couple-row__heart" aria-hidden="true">♥</span>
              <div className="couple-row__side">
                <span className="couple-row__tag font-body">المهندسة</span>
                <p className="couple-row__name">شهد محمد قشطة</p>
              </div>
            </div>
          </LuxeCard>

          <SectionBreak label="لحظات" delay={0.05} />

          {/* ٥ — العروس + لحظة معاً */}
          <PhotoPair
            left="/images/bride.jpg"
            right="/images/hands.jpg"
            leftPos="center 38%"
            rightPos="center center"
            delay={0}
          />

          <PhotoSingle
            src="/images/couple-outdoor.jpg"
            position="center 40%"
            delay={0.08}
          />

          <SectionBreak delay={0.05} />

          {/* ٦ — تفاصيل الفرح */}
          <EventDetails />

          {/* ٧ — العد التنازلي */}
          <LuxeCard variant="countdown" delay={0}>
            <Countdown />
          </LuxeCard>

          <SectionBreak label="ذكريات" delay={0.05} />

          {/* ٨ — ذكريات */}
          <PhotoPair
            left="/images/car.jpg"
            right="/images/photo-5.jpg"
            leftPos="center 45%"
            rightPos="center 30%"
            delay={0}
          />

          <PhotoSingle
            src="/images/photo-6.jpg"
            position="center 72%"
            delay={0.08}
          />

          <SectionBreak delay={0.05} />

          {/* ٩ — الختام */}
          <LuxeCard variant="closing" delay={0}>
            <div className="closing-arch" />
            <h3 className="closing__title font-display">حضوركم يزيد فرحتنا</h3>
            <p className="closing__sub font-verse">نتشرف بحضوركم ومشاركتكم أجمل لحظاتنا</p>
            <Ornament />
          </LuxeCard>
        </main>
      </div>
    </div>
  );
}
