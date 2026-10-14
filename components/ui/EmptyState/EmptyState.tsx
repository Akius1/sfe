import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { Icon, type IconName } from '../Icon'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  icon: IconName
  title: string
  description?: string
  tone?: 'primary' | 'danger'
  action?: ReactNode
  className?: string
}

/** Centered icon, message and optional action for empty, not-found and error states. */
export function EmptyState({
  icon,
  title,
  description,
  tone = 'primary',
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cx(styles.root, className)}>
      <span className={cx(styles.icon, styles[tone])}>
        <Icon name={icon} size={22} />
      </span>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
