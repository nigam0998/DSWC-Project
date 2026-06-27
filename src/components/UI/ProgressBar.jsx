import { motion } from 'framer-motion';

export default function ProgressBar({
 value = 0,
 max = 100,
 label = '',
 showLabel = true,
 showMarker = false,
 markerValue = 75,
 markerLabel = '75%',
 size = 'md',
 color = 'auto',
 className = '',
 animate = true,
}) {
 const percentage = Math.min(100, Math.max(0, (value / max) * 100));

 // Auto color based on value
 let fillColor = color;
 if (color === 'auto') {
  if (percentage >= 85) fillColor = 'success';
  else if (percentage >= 75) fillColor = 'primary';
  else if (percentage >= 60) fillColor = 'warning';
  else fillColor = 'danger';
 }

 const heights = { sm: '16px', md: '24px', lg: '32px' };

 return (
  <div className={`comic-progress ${className}`} style={{ height: heights[size] }}>
   <motion.div
    className={`comic-progress__fill comic-progress__fill--${fillColor}`}
    initial={animate ? { width: 0 } : false}
    animate={{ width: `${percentage}%` }}
    transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
   />
   {showLabel && (
    <span className="comic-progress__label">
     {label || `${percentage.toFixed(1)}%`}
    </span>
   )}
   {showMarker && (
    <div
     className="comic-progress__marker"
     style={{ left: `${markerValue}%` }}
     data-label={markerLabel}
    />
   )}
  </div>
 );
}
