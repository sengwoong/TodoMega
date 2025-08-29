import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import ModalPortal from 'components/ModalPortal';

const ModalCtx = createContext(null);

function Root({ open, onClose, options = {}, children }) {

  const defaults = {
    closeOnBackdrop: true,
    closeOnEsc: true,
    ariaLabel: undefined,
    overlayStyle: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)' },
    containerStyle: { position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  };
  const cfg = { ...defaults, ...(options || {}) };

  const containerRef = useRef(null);

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


