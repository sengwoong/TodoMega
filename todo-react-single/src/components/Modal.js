import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
// Modal (컴파운드 컴포넌트 + 포탈)
// - Root/Content/Title/Body/Actions으로 구성되어 조합해서 사용합니다.
// - ESC 키와 바깥(백드롭) 클릭으로 닫힐 수 있습니다.
// - 포탈로 document.body에 렌더되어 페이지 어느 위치에서도 위에 뜹니다.
import ModalPortal from 'hook/ModalPortal';

const ModalCtx = createContext(null); // 자식들이 onClose, cfg(설정)에 접근하기 위한 컨텍스트

function Root({ open, onClose, options = {}, children }) {
  // 기본 옵션: 필요 시 options로 덮어씌웁니다.
  const defaults = {
    closeOnBackdrop: true,
    closeOnEsc: true,
    ariaLabel: undefined,
    overlayStyle: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)' },
    containerStyle: { position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  };
  const cfg = { ...defaults, ...(options || {}) };

  const containerRef = useRef(null);

  // ESC 키로 닫기
  useEffect(() => {
    if (!cfg.closeOnEsc || !open) return;
    function onKey(e) {
      if (e.key === 'Escape') {
        onClose && onClose();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [cfg.closeOnEsc, onClose, open]);

  // 백드롭 클릭으로 닫기 (컨테이너 자신을 클릭한 경우)
  function handleBackdropClick(e) {
    if (!cfg.closeOnBackdrop) return;
    if (!containerRef.current) return;
    if (e.target === containerRef.current) {
      onClose && onClose();
    }
  }

  const value = useMemo(() => ({ onClose, cfg }), [onClose, cfg]);

  return open ? (
    <ModalCtx.Provider value={value}>
      <ModalPortal>
        <Overlay />
        <div
          ref={containerRef}
          onMouseDown={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label={cfg.ariaLabel || 'Dialog'}
          style={cfg.containerStyle}
        >
          {children}
        </div>
      </ModalPortal>
    </ModalCtx.Provider>
  ) : null;
}

function Overlay(props) {
  const { cfg } = useContext(ModalCtx) || { cfg: {} };
  return <div aria-hidden style={cfg.overlayStyle} {...props} />;
}

function Content({ children, style, size = 'md' }) {
  const base = { background: '#fff', minWidth: 320, maxWidth: '90vw', padding: 16, borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' };
  const sizeStyle = size === 'lg' ? { maxWidth: 720 } : size === 'sm' ? { maxWidth: 480 } : {};
  return <div style={{ ...base, ...sizeStyle, ...(style || {}) }}>{children}</div>;
}

function Title({ children }) {
  return <h3 style={{ marginTop: 0 }}>{children}</h3>;
}

function Body({ children }) {
  return <div style={{ marginBottom: 16 }}>{children}</div>;
}

function Actions({ children }) {
  return <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>{children}</div>;
}

const Modal = Root;
Modal.Root = Root;
Modal.Overlay = Overlay;
Modal.Content = Content;
Modal.Title = Title;
Modal.Body = Body;
Modal.Actions = Actions;

export default Modal;


