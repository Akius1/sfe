import { cx } from '@/lib/cx'
import { Button } from '../Button'
import { getPageItems } from './getPageItems'
import styles from './Pagination.module.css'

export interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

/** Numbered pages on wide screens, "Page x of y" between the two arrows on narrow ones. */
export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  return (
    <nav className={cx(styles.pagination, className)} aria-label="Pagination">
      <Button
        variant="secondary"
        size="sm"
        iconLeft="chevron-left"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <span className={styles.wide}>Previous</span>
        <span className={styles.narrow}>Prev</span>
      </Button>

      <ol className={styles.pages}>
        {getPageItems(page, totalPages).map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} className={styles.gap} aria-hidden>
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={cx(styles.page, item === page && styles.current)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            </li>
          )
        )}
      </ol>
      <span className={styles.summary}>
        Page {page} of {totalPages}
      </span>

      <Button
        variant="secondary"
        size="sm"
        iconRight="chevron-right"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  )
}
