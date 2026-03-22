import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function AppLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { currentUser } = useAuth();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!currentUser) return <Navigate to="/login" replace />;

  const wrapperStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-main)'
  };

  const mainAreaStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // offset for desktop sidebar
    marginLeft: '0', 
    transition: 'margin 0.3s'
  };

  // Add styles via className to inherit from index.css media queries
  // For desktop (lg): Sidebar is 260px and visible, so main area needs marginLeft: 260px.
  // The Sidebar component uses fixed positioning in desktop.

  return (
    <div style={wrapperStyle}>
      <Sidebar />
      <main 
        className="pb-20 lg:pb-0" // Add padding to bottom in mobile for BottomNav
        style={{
          ...mainAreaStyle,
          width: '100%',
          overflowX: 'hidden'
        }}
      >
        <div style={{ marginLeft: 0 }} className="lg-margin-left-260">
           {/* Add a global dynamic style for desktop offset in next css file or inline */}
           <style>{`
             @media(min-width: 769px) {
               .lg-margin-left-260 {
                 margin-left: 260px !important;
               }
             }
           `}</style>
           <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
