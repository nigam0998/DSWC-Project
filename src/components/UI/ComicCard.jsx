import { motion } from 'framer-motion';

export default function ComicCard({
 children,
 variant = '',
 className = '',
 hoverable = true,
 badge = null,
 onClick = null,
 delay = 0,
 style = {},
}) {
 const variantClass = variant ? `comic-card--${variant}` : '';
 const clickable = onClick ? 'cursor-pointer' : '';

 return (
  <motion.div
   className={`comic-card ${variantClass} ${clickable} ${className}`}
   onClick={onClick}
   style={style}
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{
    duration: 0.4,
    delay,
    ease: [0.34, 1.56, 0.64, 1],
   }}
   whileHover={hoverable ? { y: -4, boxShadow: '7px 7px 0px #1D1D2C' } : {}}
   whileTap={onClick ? { y: 2, boxShadow: '2px 2px 0px #1D1D2C' } : {}}
  >
   {badge && (
    <div style={{
     position: 'absolute',
     top: '-8px',
     right: '-8px',
     zIndex: 5,
    }}>
     {badge}
    </div>
   )}
   {children}
  </motion.div>
 );
}
