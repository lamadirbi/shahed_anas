import { motion } from 'framer-motion';

/** أنيميشن ظهور عند التمرير — بدون blur (أخف على الجوال) */
export const scrollReveal = {
  hidden: {
    opacity: 0,
    y: 48,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export const scrollViewport = {
  once: true,
  margin: '0px 0px -60px 0px',
  amount: 0.15,
};

export const scrollTransition = (delay = 0) => ({
  duration: 0.85,
  delay,
  ease: [0.16, 1, 0.3, 1],
});

export const photoReveal = {
  hidden: {
    opacity: 0,
    y: 56,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export const photoTransition = (delay = 0) => ({
  duration: 0.9,
  delay,
  ease: [0.22, 1, 0.36, 1],
});

export function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      variants={scrollReveal}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      transition={scrollTransition(delay)}
    >
      {children}
    </Tag>
  );
}
