import type { Transaction } from '@/types/api'
import { Money } from '@/components/ui'
import { cx } from '@/lib/cx'
import { formatDateTime, formatTime, isCredit, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import { StatusBadge } from './StatusBadge'
import { TransactionAvatar } from './TransactionAvatar'
import styles from './TransactionRow.module.css'

export interface TransactionRowProps {
  transaction: Transaction
  onSelect?: (transaction: Transaction) => void
  /** Use 'time' when the row sits under a date heading. */
  timestamp?: 'datetime' | 'time'
}

export function TransactionRow({ transaction: tx, onSelect, timestamp = 'datetime' }: TransactionRowProps) {
  const credit = isCredit(tx.type)

  return (
    <button type="button" className={styles.row} aria-haspopup="dialog" onClick={() => onSelect?.(tx)}>
      <span className={styles.avatar}>
        <TransactionAvatar transaction={tx} />
      </span>
      <span className={styles.main}>
        <span className={styles.title}>{TRANSACTION_TYPE_LABELS[tx.type]}</span>
        {/* Narration is untrusted upstream text. Render it as text only. */}
        <span className={styles.narration}>{tx.narration}</span>
      </span>
      <StatusBadge status={tx.status} className={styles.status} />
      <span className={styles.end}>
        <Money
          amount={tx.amount}
          currency={tx.currency}
          sign={credit ? 'credit' : 'debit'}
          className={cx(styles.amount, credit && styles.credit)}
        />
        <time className={styles.time} dateTime={tx.createdAt}>
          {timestamp === 'time' ? formatTime(tx.createdAt) : formatDateTime(tx.createdAt)}
        </time>
      </span>
    </button>
  )
}
