import { motion } from 'framer-motion';

export default function SpeechBubble({
 children,
 direction = 'left',
 variant = '',
 className = '',
 animate = true,
}) {
 const directionClass = direction === 'right' ? 'speech-bubble--right' : '';

 const content = (
  <div className={`speech-bubble ${directionClass} ${className}`}>
   {children}
  </div>
 );

 if (!animate) return content;

 return (
  <motion.div
   initial={{ opacity: 0, scale: 0.8, y: 10 }}
   animate={{ opacity: 1, scale: 1, y: 0 }}
   transition={{
    duration: 0.4,
    ease: [0.34, 1.56, 0.64, 1],
   }}
  >
   {content}
  </motion.div>
 );
}
