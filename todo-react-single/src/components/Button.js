import React from 'react';
// Button
// - 공통 버튼 스타일을 제공해 코드 중복을 줄이고, 일관성을 유지합니다.
// - variant로 색상을 간단히 바꿀 수 있습니다.

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


