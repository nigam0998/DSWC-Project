import { Menu, Bell } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { toggleSidebar } = useStudent();
  const { user } = useAuth(); // Get user from auth context

  return (
    <header className="app-navbar" style={{
      padding: 'var(--space-4)',
      background: 'var(--comic-surface)',
      borderBottom: 'var(--border-thin)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-navbar)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <button
          className="mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <button className="comic-btn" style={{
          padding: '8px',
          borderRadius: '50%',
          border: 'var(--border-thin)',
          background: 'var(--comic-bg)',
        }}>
          <Bell size={20} />
        </button>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: '4px 12px 4px 4px',
          background: 'var(--comic-bg-alt)',
          border: 'var(--border-thin)',
          borderRadius: 'var(--border-radius-full)',
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--comic-primary)',
            border: '2px solid var(--comic-outline)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
            {user?.name || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
