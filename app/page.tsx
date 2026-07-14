import WishesSection from '@/components/WishesSection';
import styles from './page.module.css';

const DETAILS = [
  {
    id: 'date',
    label: 'التاريخ',
    value: 'يوم السبت الموافق',
    highlight: '15 / 8',
  },
  {
    id: 'time',
    label: 'الموعد',
    value: 'الساعة',
    highlight: '6:00 مساءً',
  },
  {
    id: 'place',
    label: 'المكان',
    value: 'دير البلح - البصة - شارع 24',
    highlight: 'لف ستوري',
  },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.texture} aria-hidden="true" />
        <div className={styles.border} aria-hidden="true" />

        <main className={styles.main}>
          <header className={styles.hero}>
            <p className={`${styles.verse} font-amiri`}>&ldquo;وجعل بينكم مودة ورحمة&rdquo;</p>
            <p className={styles.verseRef}>﴿ سورة الروم ﴾</p>
            <div className={styles.goldLine} />
            <h1 className={`${styles.title} font-amiri`}>أفراح آل حنيف وآل قشطة</h1>
            <p className={styles.subtitle}>ندعوكم لمشاركتنا فرحتنا</p>
          </header>

          <section className={styles.card}>
            <span className={styles.eyebrow}>يتشرف كل من</span>
            <div className={styles.goldLine} />
            <div className={styles.parents}>
              <p className="font-amiri">السيد معين حمزة حنيف</p>
              <span className={styles.gem} aria-hidden="true">♦</span>
              <p className="font-amiri">الحاج محمد صلاح قشطة</p>
            </div>
          </section>

          <section className={`${styles.card} ${styles.coupleCard}`}>
            <span className={styles.eyebrow}>لحضور حفل زفاف</span>
            <div className={styles.goldLine} />
            <div className={styles.couple}>
              <div>
                <span className={styles.tag}>المحاسب</span>
                <p className={`${styles.name} font-amiri`}>أنس معين حنيف</p>
              </div>
              <span className={styles.heart} aria-hidden="true">♥</span>
              <div>
                <span className={styles.tag}>المهندسة</span>
                <p className={`${styles.name} font-amiri`}>شهد محمد قشطة</p>
              </div>
            </div>
          </section>

          <section className={styles.details}>
            <h2 className={`${styles.detailsTitle} font-amiri`}>تفاصيل الفرح</h2>
            <div className={styles.detailsGrid}>
              {DETAILS.map((item) => (
                <article key={item.id} className={styles.detailCard}>
                  <span className={styles.detailLabel}>{item.label}</span>
                  <p>{item.value}</p>
                  <p className={`${styles.detailHighlight} font-amiri`}>{item.highlight}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={`${styles.card} ${styles.closing}`}>
            <h2 className={`${styles.closingTitle} font-amiri`}>حضوركم يزيد فرحتنا</h2>
            <p className={`${styles.closingSub} font-amiri`}>
              نتشرف بحضوركم ومشاركتكم أجمل لحظاتنا
            </p>
          </section>

          <WishesSection />
        </main>
      </div>
    </div>
  );
}
