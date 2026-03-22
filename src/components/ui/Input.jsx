import React from 'react';

export default function Input({ 
  label, 
  type = 'text', 
  error, 
  className = '', 
  fullWidth = true,
  icon,
  ...props 
}) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-1)',
    width: fullWidth ? '100%' : 'auto',
    marginBottom: 'var(--space-4)'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--text-main)'
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const inputStyle = {
    width: '100%',
    padding: 'var(--space-3) var(--space-4)',
    paddingLeft: icon ? 'var(--space-10)' : 'var(--space-4)',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${error ? 'var(--danger)' : 'var(--border-color)'}`,
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    backgroundColor: 'var(--bg-main)',
    color: 'var(--text-main)'
  };

  const iconStyle = {
    position: 'absolute',
    left: 'var(--space-3)',
    color: 'var(--text-muted)'
  };

  const errorStyle = {
    fontSize: '0.75rem',
    color: 'var(--danger)',
    marginTop: '2px'
  };

  return (
    <div style={containerStyle} className={className}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={inputWrapperStyle}>
        {icon && <div style={iconStyle}>{icon}</div>}
        <input 
          type={type} 
          style={inputStyle} 
          onFocus={(e) => {
            if(!error) {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.2)';
            }
          }}
          onBlur={(e) => {
            if(!error) {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
          {...props} 
        />
      </div>
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
}
