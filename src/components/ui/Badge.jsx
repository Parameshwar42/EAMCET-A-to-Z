import React from 'react';

export default function Badge({ 
  children, 
  variant = 'primary', 
  className = '' 
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.6rem',
    borderRadius: 'var(--radius-pill)',
    fontSize: '0.75rem',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  };

  const variants = {
    primary: { backgroundColor: 'var(--primary-light)', color: 'var(--primary)' },
    success: { backgroundColor: 'var(--success-light)', color: 'var(--success)' },
    danger: { backgroundColor: 'var(--danger-light)', color: 'var(--danger)' },
    warning: { backgroundColor: 'var(--warning-light)', color: 'var(--warning)' },
    neutral: { backgroundColor: 'var(--border-color)', color: 'var(--text-main)' }
  };

  const style = { ...baseStyle, ...variants[variant] };

  return (
    <span style={style} className={className}>
      {children}
    </span>
  );
}
