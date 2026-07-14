import { motion } from 'framer-motion';
import './PhotoGallery.css';
import { photoReveal, photoTransition, scrollViewport } from './scrollAnimations';

function PhotoFrame({ src, position = 'center 35%', className = '' }) {
  return (
    <div className={`photo-frame ${className}`}>
      <img
        src={src}
        alt=""
        className="photo-img"
        loading="eager"
        style={{ objectPosition: position }}
      />
    </div>
  );
}

/** صورتان متداخلتان — غلاف تحريري */
export function PhotoHeroDuo({ left, right, leftPos = 'center 30%', rightPos = 'center 40%', delay = 0 }) {
  return (
    <motion.section
      className="photo-hero-duo"
      variants={photoReveal}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      transition={photoTransition(delay)}
    >
      <figure className="photo-hero-duo__left">
        <PhotoFrame src={left} position={leftPos} />
      </figure>
      <span className="photo-hero-duo__seal" aria-hidden="true">♥</span>
      <figure className="photo-hero-duo__right">
        <PhotoFrame src={right} position={rightPos} />
      </figure>
    </motion.section>
  );
}

/** صورة كبيرة + صورة صغيرة عائمة */
export function PhotoMosaic({ main, accent, mainPos = 'center 35%', accentPos = 'center center', delay = 0 }) {
  return (
    <motion.section
      className="photo-mosaic"
      variants={photoReveal}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      transition={photoTransition(delay)}
    >
      <figure className="photo-mosaic__main">
        <PhotoFrame src={main} position={mainPos} />
      </figure>
      <motion.figure
        className="photo-mosaic__accent"
        initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -4 }}
        viewport={scrollViewport}
        transition={{ ...photoTransition(delay), delay: delay + 0.35 }}
      >
        <PhotoFrame src={accent} position={accentPos} className="photo-frame--shadow" />
      </motion.figure>
    </motion.section>
  );
}

/** تخطيط تحريري — عريضة فوق + عمودية جانبية */
export function PhotoEditorial({ wide, tall, widePos = 'center 45%', tallPos = 'center 30%', delay = 0 }) {
  return (
    <section className="photo-editorial">
      <motion.figure
        className="photo-editorial__wide"
        variants={photoReveal}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        transition={photoTransition(delay)}
      >
        <PhotoFrame src={wide} position={widePos} />
      </motion.figure>
      <motion.figure
        className="photo-editorial__tall"
        variants={photoReveal}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        transition={photoTransition(delay + 0.3)}
      >
        <PhotoFrame src={tall} position={tallPos} />
      </motion.figure>
    </section>
  );
}

/** صورتان متساويتان جنب بعض */
export function PhotoPair({ left, right, leftPos = 'center 35%', rightPos = 'center 35%', delay = 0 }) {
  return (
    <motion.section
      className="photo-pair"
      variants={photoReveal}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      transition={photoTransition(delay)}
    >
      <figure className="photo-pair__item">
        <PhotoFrame src={left} position={leftPos} />
      </figure>
      <figure className="photo-pair__item">
        <PhotoFrame src={right} position={rightPos} />
      </figure>
    </motion.section>
  );
}

/** صورة العريس — غلاف افتتاحي مع عنوان ونص */
export function PhotoGroomHero({ src, title, caption, position = 'center 28%', delay = 0 }) {
  return (
    <motion.figure
      className="photo-groom-hero"
      variants={photoReveal}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      transition={photoTransition(delay)}
      aria-label={title}
    >
      {title && (
        <div className="photo-groom-hero__heading">
          <span className="photo-groom-hero__line" aria-hidden="true" />
          <h1 className="photo-groom-hero__title font-display">{title}</h1>
          <span className="photo-groom-hero__line" aria-hidden="true" />
        </div>
      )}

      <div className="photo-groom-hero__frame">
        <img
          src={src}
          alt=""
          className="photo-groom-hero__img"
          loading="eager"
          style={{ objectPosition: position }}
        />
        {caption && (
          <div className="photo-groom-hero__bottom" aria-hidden="true">
            <span className="photo-groom-hero__line" />
            <p className="photo-groom-hero__caption font-display">{caption}</p>
            <span className="photo-groom-hero__line" />
          </div>
        )}
      </div>
    </motion.figure>
  );
}

/** صورة واحدة */
export function PhotoSingle({ src, position = 'center 35%', delay = 0, variant = 'default' }) {
  return (
    <motion.figure
      className={`photo-single ${variant === 'hero' ? 'photo-single--hero' : ''}`}
      variants={photoReveal}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      transition={photoTransition(delay)}
    >
      <PhotoFrame src={src} position={position} />
    </motion.figure>
  );
}

/** ثلاث صور بتوزيع بولارويد مائل */
export function PhotoCollage({ images, positions, delay = 0 }) {
  const defaultPositions = ['center 18%', 'center 72%', '28% 22%'];
  const tilts = ['photo-collage__item--tilt-l', '', 'photo-collage__item--tilt-r'];

  return (
    <motion.section
      className="photo-collage"
      variants={photoReveal}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      transition={photoTransition(delay)}
    >
      {images.map((src, i) => (
        <figure key={src} className={`photo-collage__item ${tilts[i]}`}>
          <PhotoFrame
            src={src}
            position={positions?.[i] ?? defaultPositions[i]}
          />
        </figure>
      ))}
    </motion.section>
  );
}
