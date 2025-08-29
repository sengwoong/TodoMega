import React from 'react';

function Button({ children, variant = 'primary', style, ...rest }) {
  const base = {
    padding: '6px 12px',
    border: '1px solid #ccc',
    borderRadius: 4,
    cursor: 'pointer',
    background: '#fff',
  };
  const variants = {
    primary: { background: '#1976d2', color: '#fff', borderColor: '#1976d2' },
    danger: { background: '#d32f2f', color: '#fff', borderColor: '#d32f2f' },
    ghost: { background: '#fff', color: '#333', borderColor: '#ddd' },
  };
  const merged = { ...base, ...(variants[variant] || {}), ...(style || {}) };
  return (
    <button {...rest} style={merged}>
      {children}
    </button>
  );
}

export default Button;


