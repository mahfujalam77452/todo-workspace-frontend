'use client';

import { useEffect, useRef } from 'react';
import NavLinks from './NavLinks';
import styles from './Layout.module.css';

// Drawer built on the native <dialog>: Escape key and focus handling come from the browser.
export default function MobileMenu({ open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleBackdropClick(event) {
    if (event.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.drawer}
      aria-label="Navigation menu"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className={styles.drawerHeader}>
        <span>TODOs Workspace</span>
        <button type="button" className={styles.menuButton} onClick={onClose} aria-label="Close menu">
          &times;
        </button>
      </div>
      <NavLinks onNavigate={onClose} />
    </dialog>
  );
}