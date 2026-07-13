import { useState, useEffect } from 'react';
import './Countdown.css';

const TARGET = new Date('2026-08-23T18:00:00+03:00');

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function Countdown() {
  const [time, setTime] = useState(getRemaining());

  function getRemaining() {
    const diff = Math.max(0, TARGET - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }

  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'يوم', value: time.days },
    { label: 'ساعة', value: time.hours },
    { label: 'دقيقة', value: time.minutes },
    { label: 'ثانية', value: time.seconds },
  ];

  return (
    <div className="countdown">
      <h3 className="card__heading font-rakkas">العد التنازلي</h3>
      <div className="gold-line" />
      <p className="countdown-label font-cairo">يبدأ الاحتفال بعد</p>
      <div className="countdown-grid">
        {units.map((u) => (
          <div key={u.label} className="countdown-unit">
            <span className="countdown-num font-cairo">{pad(u.value)}</span>
            <span className="countdown-text font-cairo">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
