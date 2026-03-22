import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  fullWidth = false,
  ...props 
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    borderRadius: 'var(--radius-pill)', /* Pill-shaped */
    transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '0.5px',
    userSelect: 'none'
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 8px 16px -4px rgba(67,56,202,0.4)'
    },
    secondary: {
      background: 'linear-gradient(135deg, var(--secondary) 0%, #14b8a6 100%)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 8px 16px -4px rgba(13,148,136,0.4)'
    },
    outline: {
      backgroundColor: 'rgba(255,255,255,0.8)',
      color: 'var(--primary)',
      border: '1.5px solid var(--primary)',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-main)',
      border: '1.5px solid transparent'
    },
    danger: {
      backgroundColor: 'var(--danger)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 8px 16px -4px rgba(239,68,68,0.4)'
    }
  };

  const sizes = {
    sm: { padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem' },
    md: { padding: 'var(--space-3) var(--space-6)', fontSize: '1rem' },
    lg: { padding: 'var(--space-4) var(--space-8)', fontSize: '1.125rem' }
  };

  const combinedStyle = {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size],
    width: fullWidth ? '100%' : 'auto',
  };

  return (
      <button 
      style={combinedStyle} 
      className={`btn-${variant} ${className}`}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        if(variant === 'primary') e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(67,56,202,0.6)';
        if(variant === 'secondary') e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(13,148,136,0.6)';
        if(variant === 'outline') { e.currentTarget.style.backgroundColor = 'var(--primary-light)'; e.currentTarget.style.borderColor = 'var(--primary-hover)'; }
        if(variant === 'ghost') { e.currentTarget.style.backgroundColor = 'var(--border-color)'; }
        if(variant === 'danger') e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(239,68,68,0.6)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'none';
        if(variant === 'primary') e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(67,56,202,0.4)';
        if(variant === 'secondary') e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(13,148,136,0.4)';
        if(variant === 'outline') { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)'; e.currentTarget.style.borderColor = 'var(--primary)'; }
        if(variant === 'ghost') e.currentTarget.style.backgroundColor = 'transparent';
        if(variant === 'danger') e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(239,68,68,0.4)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.95)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      {...props}
    >
      {children}
    </button>
  );
}
