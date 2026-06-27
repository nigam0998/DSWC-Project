import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarCheck,
  GraduationCap,
  FlaskConical,
  BookOpen,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/attendance', label: 'Attendance', icon: CalendarCheck },
  { path: '/app/grades', label: 'Grades & CGPA', icon: GraduationCap },
  { path: '/app/simulator', label: 'Simulator', icon: FlaskConical },
  { path: '/app/subjects', label: 'Subjects', icon: BookOpen },
  { path: '/app/recommendations', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebar, toggleSidebar } = useStudent();
  const { logout } = useAuth();

  return (
    <>
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay--visible' : ''}`}
        onClick={() => setSidebar(false)}
      />

      <motion.aside
        className={`app-sidebar ${sidebarOpen ? 'app-sidebar--open' : ''}`}
        initial={false}
        animate={{
          width: sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="app-sidebar__header" style={{
          padding: 'var(--space-4)',
          borderBottom: 'var(--border-thin)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
        }}>
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xl)',
                  color: 'var(--comic-primary)',
                }}
              >
                <Zap size={24} />
                <span>AcadTwin</span>
              </motion.div>
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Zap size={24} color="var(--comic-primary)" />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className="comic-btn"
            style={{
              padding: '4px',
              border: 'var(--border-thin)',
              background: 'var(--comic-surface)',
              display: sidebarOpen ? 'block' : 'none',
            }}
            onClick={toggleSidebar}
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {!sidebarOpen && (
          <button
            className="comic-btn"
            style={{
              padding: '4px',
              border: 'var(--border-thin)',
              background: 'var(--comic-surface)',
              margin: 'var(--space-2) auto',
              display: 'block',
            }}
            onClick={toggleSidebar}
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Navigation */}
        <nav className="app-sidebar__nav" style={{ padding: 'var(--space-2)' }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `comic-btn ${isActive ? 'comic-btn--primary' : 'comic-btn--outline'}`
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  marginBottom: 'var(--space-2)',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  padding: sidebarOpen ? 'var(--space-3) var(--space-4)' : 'var(--space-3)',
                }}
                title={!sidebarOpen ? item.label : undefined}
                end={item.path === '/app'}
              >
                <Icon size={20} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </nav>
        
        {/* Logout Button */}
        <div style={{ marginTop: 'auto', padding: 'var(--space-4)', borderTop: 'var(--border-thin)' }}>
          <button
            onClick={logout}
            className="comic-btn comic-btn--outline"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              padding: sidebarOpen ? 'var(--space-3) var(--space-4)' : 'var(--space-3)',
              color: 'var(--comic-danger)',
              borderColor: 'var(--comic-danger)',
            }}
            title={!sidebarOpen ? 'Log Out' : undefined}
          >
            <LogOut size={20} />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Log Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
