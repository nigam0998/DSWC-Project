import { motion } from 'framer-motion';

const variants = {
 pow: { label: 'POW!', className: 'action-badge--pow' },
 boom: { label: 'BOOM!', className: 'action-badge--boom' },
 zap: { label: 'ZAP!', className: 'action-badge--zap' },
 wham: { label: 'WHAM!', className: 'action-badge--wham' },
};

export default function ActionBadge({
 type = 'pow',
 label = null,
 size = 'sm',
 className = '',
}) {
 const config = variants[type] || variants.pow;
 const sizeClass = size === 'lg' ? 'action-badge--lg' : '';

 return (
  <motion.span
   className={`action-badge ${config.className} ${sizeClass} ${className}`}
   initial={{ scale: 0, rotate: -15 }}
   animate={{ scale: 1, rotate: -3 }}
   transition={{
    type: 'spring',
    stiffness: 400,
    damping: 15,
   }}
  >
   {label || config.label}
  </motion.span>
 );
}
