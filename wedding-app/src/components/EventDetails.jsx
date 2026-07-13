import { motion } from 'framer-motion';
import './EventDetails.css';
import { scrollReveal, scrollTransition, scrollViewport } from './scrollAnimations';

const DETAILS = [
  {
    id: 'date',
    label: 'التاريخ',
    value: 'يوم الأحد الموافق',
    highlight: '23 / 8',
    icon: '✦',
  },
  {
    id: 'time',
    label: 'الموعد',
    value: 'الساعة',
    highlight: '6:00 مساءً',
    icon: '◆',
  },
  {
    id: 'place',
    label: 'المكان',
    value: 'دير البلح - البصة - شارع 24',
    highlight: 'لف ستوري',
    icon: '✦',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.22, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 40, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function EventDetails() {
  return (
    <motion.section
      className="event-details"
      variants={scrollReveal}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      transition={scrollTransition(0)}
    >
      <div className="event-details__glow" aria-hidden="true" />
      <div className="event-details__sparkles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="event-details__sparkle" style={{ '--i': i }} />
        ))}
      </div>

      <motion.div
        className="event-details__header"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <span className="event-details__eyebrow font-cairo">ندعوكم</span>
        <h3 className="event-details__title font-rakkas">تفاصيل الفرح</h3>
        <motion.div
          className="event-details__line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
        />
      </motion.div>

      <motion.div
        className="event-details__grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        {DETAILS.map((d) => (
          <motion.article key={d.id} className="event-details__card" variants={item}>
            <span className="event-details__card-icon" aria-hidden="true">{d.icon}</span>
            <span className="event-details__card-label font-cairo">{d.label}</span>
            <p className="event-details__card-value font-cairo">{d.value}</p>
            <p className="event-details__card-highlight font-amiri">{d.highlight}</p>
            <span className="event-details__card-shine" aria-hidden="true" />
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  );
}
