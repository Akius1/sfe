import { cx } from '@/lib/cx'
import styles from './Skeleton.module.css'

export interface SkeletonProps {
  /** Any CSS length. Numbers are pixels. */
  width: number | string
  height?: number
  circle?: boolean
  className?: string
}

/** Placeholder block for content that is still loading. Decorative, so announce loading on the container. */
export function Skeleton({ width, height = 12, circle, className }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={cx(styles.skeleton, className)}
      style={{ width, height: circle ? width : height }}
    />
  )
}
