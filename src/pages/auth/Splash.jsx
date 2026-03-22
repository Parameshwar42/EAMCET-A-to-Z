import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

export default function Splash() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: 'var(--primary)',
    color: '#fff',
    padding: 'var(--space-6)',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h1" style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>A to Z EAMCET</h1>
        <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>Your Shortcut to a Top Rank</p>
      </div>
      
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        marginBottom: 'var(--space-10)'
      }}>
        <ul style={{ listStyle: 'none', textAlign: 'left', lineHeight: '2' }}>
          <li>✓ Daily Tracked Setup</li>
          <li>✓ Chapter-wise Practice</li>
          <li>✓ Shortcut Video Lessons</li>
          <li>✓ Full Syllabus Mocks</li>
        </ul>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%', maxWidth: '300px' }}>
         <Button 
           variant="secondary" 
           size="lg" 
           fullWidth 
           onClick={() => navigate('/login')}
           style={{ backgroundColor: '#fff', color: 'var(--primary)', border: 'none' }}
         >
           Get Started
         </Button>
         <Button 
           variant="ghost" 
           fullWidth 
           style={{ color: '#fff' }}
         >
           Browse Free Material
         </Button>
      </div>
    </div>
  );
}
