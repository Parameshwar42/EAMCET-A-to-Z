import React from 'react';
import { NavLink } from 'react-router-dom';
// Using Lucide icons
import * as Icons from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { currentUser } = useAuth();
  
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: 'LayoutDashboard' },
    { path: '/study-plan', label: 'Study Plan', icon: 'BookOpen' },
    { path: '/practice', label: 'Practice', icon: 'PenLine' },
    { path: '/mock-tests', label: 'Mock Tests', icon: 'FileText' },
    { path: '/revision', label: 'Revision', icon: 'MessageCircle' }, // re-using icon for demo
    { path: '/materials', label: 'AP&TS PYQs', icon: 'Library' },
    { path: '/profile', label: 'Profile', icon: 'User' },
  ];

  if (currentUser?.email === 'admin@eamcet2026.com') {
    navItems.push({ path: '/admin', label: 'Admin Hub', icon: 'ShieldAlert' });
  }
  const sidebarStyle = {
    width: '260px',
    backgroundColor: 'var(--bg-card)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    padding: 'var(--space-6) 0',
    height: '100vh',
    position: 'fixed'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--primary)',
    padding: '0 var(--space-6)',
    marginBottom: 'var(--space-8)'
  };

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-3) var(--space-6)',
    color: 'var(--text-muted)',
    fontWeight: '500',
    transition: 'all 0.2s',
    textDecoration: 'none'
  };

  const activeStyle = {
    ...linkStyle,
    color: 'var(--primary)',
    backgroundColor: 'var(--primary-light)',
    borderRight: '3px solid var(--primary)'
  };

  return (
    <aside style={sidebarStyle} className="md:hidden lg:flex">
      <div style={logoStyle}>A to Z EAMCET</div>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {navItems.map(item => {
          const IconComponent = Icons[item.icon] || Icons.Circle;
          return (
            <NavLink 
              key={item.path} 
              to={item.path}
              style={({ isActive }) => isActive ? activeStyle : linkStyle}
              onMouseOver={(e) => {
                if(!e.currentTarget.style.backgroundColor.includes('var(--primary-light)')) {
                   e.currentTarget.style.backgroundColor = 'var(--bg-main)';
                }
              }}
              onMouseOut={(e) => {
                if(!e.currentTarget.style.borderRight) {
                   e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <IconComponent size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div style={{ padding: 'var(--space-4) var(--space-6)' }}>
        <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-lg)' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--primary)' }}>Go Premium</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>Unlock full access</p>
          <button style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 'bold' }}>Upgrade</button>
        </div>
      </div>
    </aside>
  );
}
