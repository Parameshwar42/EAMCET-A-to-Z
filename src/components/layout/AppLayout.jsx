import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import TopHeader from './TopHeader';

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
    marginLeft: '0', 
    transition: 'margin 0.3s'
  };

  return (
    <div style={wrapperStyle}>
      <Sidebar />
      <main 
        className="pb-20 lg:pb-0 w-full overflow-x-hidden"
        style={mainAreaStyle}
      >
        <div className="lg-margin-left-260 flex flex-col min-h-screen">
           <TopHeader />
           <div className="flex-1">
              <Outlet />
           </div>
           
           <style>{`
             @media(min-width: 769px) {
               .lg-margin-left-260 {
                 margin-left: 260px !important;
               }
             }
           `}</style>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

