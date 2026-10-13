import { useId } from 'react'
import type { Transaction } from '@/types/api'
import { Skeleton } from '@/components/ui'
import { groupByDay } from './groupByDay'
import { TransactionRow } from './TransactionRow'
import styles from './TransactionList.module.css'

export interface TransactionListProps {
  transactions: readonly Transaction[]
  onSelect: (transaction: Transaction) => void
}

/** Transactions grouped under a heading per day. Expects them sorted by date, as the API returns them. */
export function TransactionList({ transactions, onSelect }: TransactionListProps) {
  const id = useId()

  return (
    <>
      {groupByDay(transactions).map((group, index) => (
        <section key={group.label} aria-labelledby={`${id}-${index}`}>
          <h2 id={`${id}-${index}`} className={styles.day}>
            {group.label}
          </h2>
          <ul className={styles.rows}>
            {group.transactions.map((transaction) => (
              <li key={transaction.id}>
                <TransactionRow transaction={transaction} onSelect={onSelect} timestamp="time" />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}

export function TransactionListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div role="status">
      <span className="visually-hidden">Loading transactions</span>
      <div className={styles.day}>
        <Skeleton width={72} height={10} />
      </div>
      <ul className={styles.rows} aria-hidden>
        {Array.from({ length: rows }, (_, index) => (
          <li key={index} className={styles.skeletonRow}>
            <Skeleton width={40} circle />
            <span className={styles.skeletonLines}>
              <Skeleton width={132} />
              <Skeleton width={280} />
            </span>
            <span className={styles.skeletonEnd}>
              <Skeleton width={104} />
              <Skeleton width={44} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
