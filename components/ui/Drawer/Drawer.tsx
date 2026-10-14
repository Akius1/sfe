'use client'
import { type ReactNode, useEffect, useId, useRef } from 'react'
import { Icon } from '../Icon'
import styles from './Drawer.module.css'

export interface DrawerProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

/**
 * Side panel on desktop, bottom sheet on small screens. Built on a modal <dialog>, which provides the
 * focus trap, Escape handling, focus restoration and an inert page behind it.
 */
export function Drawer({ open, title, onClose, children, footer }: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      // Fires for Escape too. When the parent closed us, `open` is already false and there is nothing to report.
      onClose={() => {
        if (open) onClose()
      }}
      // The panel fills the dialog, so only a click on the backdrop targets the dialog itself.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </dialog>
  )
}
