'use client';

import { useEffect, useId, useRef } from 'react';
import styles from './Modal.module.css';

// Uses the native <dialog>: focus trap, Escape key and backdrop come from the browser.
export default function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);
  const titleId = useId();

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
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className={styles.header}>
        <h2 id={titleId} className={styles.title}>{title}</h2>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          {/* TODO: add close (X) icon here */}
          &times;
        </button>
      </div>
      <div className={styles.body}>{children}</div>
    </dialog>
  );
}