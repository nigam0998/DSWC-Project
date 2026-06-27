import { useEffect, useState, useRef } from 'react';

export default function StatBadge({
 value,
 label,
 suffix = '',
 color = 'primary',
 size = 100,
 decimals = 1,
 animate = true,
}) {
 const [displayValue, setDisplayValue] = useState(0);
 const ref = useRef(null);

 useEffect(() => {
  if (!animate) {
   setDisplayValue(value);
   return;
  }

  let start = 0;
  const duration = 1200;
  const startTime = performance.now();

  function step(currentTime) {
   const elapsed = currentTime - startTime;
   const progress = Math.min(elapsed / duration, 1);
   // Ease out cubic
   const eased = 1 - Math.pow(1 - progress, 3);
   const current = start + (value - start) * eased;
   setDisplayValue(current);

   if (progress < 1) {
    requestAnimationFrame(step);
   }
  }

  requestAnimationFrame(step);
 }, [value, animate]);

 return (
  <div className="stat-badge" ref={ref}>
   <div
    className={`stat-badge__ring stat-badge__ring--${color}`}
    style={{ width: size, height: size }}
   >
    <span className="stat-badge__value">
     {typeof value === 'number'
      ? displayValue.toFixed(decimals)
      : value}
     {suffix}
    </span>
   </div>
   {label && <span className="stat-badge__label">{label}</span>}
  </div>
 );
}
