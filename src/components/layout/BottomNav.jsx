import React from 'react';
import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';

const bottomNavItems = [
  { path: '/dashboard', label: 'Home', icon: 'LayoutDashboard' },
  { path: '/practice', label: 'Practice', icon: 'PenLine' },
  { path: '/mock-tests', label: 'Tests', icon: 'FileText' },
  { path: '/revision', label: 'Revision', icon: 'Zap' }, // using Zap for revision/flash
  { path: '/profile', label: 'Profile', icon: 'User' },
];

export default function BottomNav() {
  const navStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 'var(--space-2) 0',
    paddingBottom: 'calc(var(--space-2) + env(safe-area-inset-bottom))',
    zIndex: 1000,
    boxShadow: '0 -4px 10px rgba(0,0,0,0.03)'
  };
  
  // Use data-theme block to override dark mode colors if needed

  const linkStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    fontSize: '0.7rem',
    fontWeight: '500',
    flex: 1,
    padding: 'var(--space-1)',
    transition: 'color 0.2s'
  };

  const activeColor = 'var(--primary)';

  return (
    <nav style={navStyle} className="lg:hidden md:flex">
      {bottomNavItems.map(item => {
        const IconComponent = Icons[item.icon] || Icons.Circle;
        return (
          <NavLink 
            key={item.path} 
            to={item.path}
            style={({ isActive }) => ({
              ...linkStyle,
              color: isActive ? activeColor : 'var(--text-muted)'
            })}
          >
            {({ isActive }) => (
              <>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  transition: 'background-color 0.2s'
                }}>
                  <IconComponent size={20} color={isActive ? activeColor : 'var(--text-muted)'} />
                </div>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
