import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
 const location = useLocation();

 return (
  <div className="app-layout">
   <Sidebar />
   <Navbar />
   <main className="app-main">
    <div className="app-main__inner">
     <AnimatePresence mode="wait">
      <motion.div
       key={location.pathname}
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -20 }}
       transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
       <Outlet />
      </motion.div>
     </AnimatePresence>
    </div>
   </main>
  </div>
 );
}
