import React from 'react';

export default function Card({ 
  children, 
  className = '', 
  glass = false,
  padding = 'p-6',
  clickable = false,
  ...props 
}) {
  const style = {
    backgroundColor: glass ? 'rgba(255, 255, 255, 0.7)' : 'var(--bg-card)',
    backdropFilter: glass ? 'blur(16px)' : 'none',
    WebkitBackdropFilter: glass ? 'blur(16px)' : 'none',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-card)',
    border: '1px solid rgba(255,255,255,0.7)',
    transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
    cursor: clickable ? 'pointer' : 'default',
  };

  const interactiveProps = clickable ? {
    onMouseOver: (e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(67,56,202,0.15)';
      e.currentTarget.style.borderColor = 'rgba(67,56,202,0.1)';
    },
    onMouseOut: (e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
    }
  } : {};

  return (
    <div 
      style={style} 
      className={`${padding} ${className}`}
      {...interactiveProps}
      {...props}
    >
      {children}
    </div>
  );
}
