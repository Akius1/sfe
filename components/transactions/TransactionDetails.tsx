'use client'
import { useEffect, useState } from 'react'
import type { Transaction } from '@/types/api'
import { Button, EmptyState, Icon, Money, Skeleton } from '@/components/ui'
import { ApiError } from '@/lib/api/client'
import { useTransaction } from '@/lib/api/queries'
import { cx } from '@/lib/cx'
import { formatDateTime, isCredit, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import { StatusBadge } from './StatusBadge'
import { TransactionAvatar } from './TransactionAvatar'
import styles from './TransactionDetails.module.css'

export interface TransactionDetailsProps {
  id: string
  /** The transaction if the caller already has it, e.g. from the list. Avoids a request. */
  initialData?: Transaction
  onClose: () => void
}

/** Body of the details panel: loads the transaction by id and covers the loading, missing and error cases. */
export function TransactionDetails({ id, initialData, onClose }: TransactionDetailsProps) {
  const { data, error, isFetching, refetch } = useTransaction(id, initialData)

  if (data) return <Details transaction={data} />

  if (error instanceof ApiError && error.status === 404) {
    return (
      <EmptyState
        icon="search"
        title="Transaction not found"
        description="It may have been removed, or the link is wrong."
        action={
          <Button variant="secondary" onClick={onClose}>
            Back to transactions
          </Button>
        }
      />
    )
  }

  if (error) {
    return (
      <div role="alert">
        <EmptyState
          icon="alert"
          tone="danger"
          title="We couldn’t load this transaction"
          description="Check your connection and try again."
          action={
            <Button iconLeft="refresh" disabled={isFetching} onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      </div>
    )
  }

  return <DetailsSkeleton />
}

function summarise(tx: Transaction): string {
  const label = TRANSACTION_TYPE_LABELS[tx.type]
  if (!tx.counterparty) return label
  if (tx.type === 'transfer_out') return `${label} to ${tx.counterparty}`
  if (tx.type === 'transfer_in') return `${label} from ${tx.counterparty}`
  return label
}

function Details({ transaction: tx }: { transaction: Transaction }) {
  const credit = isCredit(tx.type)

  return (
    <>
      <div className={styles.hero}>
        <TransactionAvatar transaction={tx} size="lg" />
        <p className={styles.summary}>{summarise(tx)}</p>
        <Money
          amount={tx.amount}
          currency={tx.currency}
          sign={credit ? 'credit' : 'debit'}
          className={cx(styles.amount, credit && styles.credit)}
        />
        <StatusBadge status={tx.status} />
      </div>

      <h3 className={styles.heading}>Details</h3>
      <dl className={styles.list}>
        <div className={styles.row}>
          <dt>Reference</dt>
          <dd className={styles.reference}>
            <span>{tx.reference}</span>
            <CopyButton value={tx.reference} label="Copy reference" />
          </dd>
        </div>
        <div className={styles.row}>
          <dt>Date</dt>
          <dd>
            <time dateTime={tx.createdAt}>{formatDateTime(tx.createdAt)}</time>
          </dd>
        </div>
        <div className={styles.row}>
          <dt>Type</dt>
          <dd>{TRANSACTION_TYPE_LABELS[tx.type]}</dd>
        </div>
        {tx.counterparty && (
          <div className={styles.row}>
            <dt>Counterparty</dt>
            <dd>{tx.counterparty}</dd>
          </div>
        )}
        <div className={styles.row}>
          <dt>Narration</dt>
          <dd>{tx.narration}</dd>
        </div>
      </dl>

      <h3 className={styles.heading}>Summary</h3>
      <dl className={styles.list}>
        <div className={styles.row}>
          <dt>Amount</dt>
          <dd>
            <Money amount={tx.amount} currency={tx.currency} />
          </dd>
        </div>
        <div className={styles.row}>
          <dt>Fee</dt>
          <dd>
            <Money amount={tx.fee} currency={tx.currency} />
          </dd>
        </div>
        <div className={cx(styles.row, styles.total)}>
          <dt>Total</dt>
          <dd>
            <Money amount={tx.amount + tx.fee} currency={tx.currency} />
          </dd>
        </div>
      </dl>
    </>
  )
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // Clipboard access can be denied. The value stays on screen and selectable.
    }
  }

  return (
    <>
      <button type="button" className={styles.copy} onClick={copy} aria-label={label}>
        <Icon name="copy" size={16} />
      </button>
      <span role="status" className={copied ? styles.copied : 'visually-hidden'}>
        {copied && 'Copied'}
      </span>
    </>
  )
}

function DetailsSkeleton() {
  return (
    <div role="status">
      <span className="visually-hidden">Loading transaction</span>
      <div className={styles.hero}>
        <Skeleton width={48} circle />
        <Skeleton width={160} />
        <Skeleton width={200} height={24} />
        <Skeleton width={84} height={20} />
      </div>
      <div className={styles.skeletonList}>
        {[90, 140, 110, 140].map((width, index) => (
          <div key={index} className={styles.skeletonRow}>
            <Skeleton width={width} />
            <Skeleton width={140} />
          </div>
        ))}
      </div>
    </div>
  )
}
