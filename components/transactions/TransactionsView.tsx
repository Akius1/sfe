'use client'
import { useEffect } from 'react'
import type { Transaction } from '@/types/api'
import { Button, Card, Drawer, EmptyState, Pagination } from '@/components/ui'
import { useTransactions } from '@/lib/api/queries'
import { TransactionDetails } from './TransactionDetails'
import { TransactionFilters } from './TransactionFilters'
import { TransactionList, TransactionListSkeleton } from './TransactionList'
import { useTransactionsUrlState } from './useTransactionsUrlState'
import styles from './TransactionsView.module.css'

const PAGE_SIZE = 20

const count = new Intl.NumberFormat('en-NG')
const plural = (n: number, noun: string) => `${count.format(n)} ${noun}${n === 1 ? '' : 's'}`

export function TransactionsView() {
  const { state, update } = useTransactionsUrlState()
  const { q, type, status, page, txn } = state
  const hasFilters = q !== '' || type !== null || status !== null

  const { data, isError, isFetching, isPlaceholderData, refetch } = useTransactions({
    page,
    limit: PAGE_SIZE,
    q: q || undefined,
    type: type ?? undefined,
    status: status ?? undefined,
  })

  const transactions = data?.data
  const total = data?.meta?.total ?? 0
  const totalPages = data?.meta?.totalPages ?? 1

  // A stale or hand-edited link can point past the last page. Land on the last page instead of an empty one.
  const isPastLastPage = data !== undefined && !isPlaceholderData && total > 0 && page > totalPages
  useEffect(() => {
    if (isPastLastPage) update({ page: totalPages }, 'replace')
  }, [isPastLastPage, totalPages, update])

  const goToPage = (next: number) => {
    update({ page: next })
    window.scrollTo({ top: 0 })
  }

  const clearFilters = () => update({ q: '', type: null, status: null, page: 1 })

  let subtitle = ' '
  if (data) subtitle = hasFilters ? plural(total, 'result') : plural(total, 'transaction')

  let content
  if (transactions && !isPastLastPage) {
    if (transactions.length > 0) {
      content = <TransactionList transactions={transactions} onSelect={(tx) => update({ txn: tx.id })} />
    } else if (hasFilters) {
      content = (
        <EmptyState
          icon="search"
          title="No transactions match your filters"
          description="Try a different search term or remove some filters."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      )
    } else {
      content = (
        <EmptyState
          icon="inbox"
          title="No transactions yet"
          description="When you add money, send a transfer or pay with your card, it will show up here."
        />
      )
    }
  } else if (isError) {
    content = (
      <div role="alert">
        <EmptyState
          icon="alert"
          tone="danger"
          title="We couldn’t load your transactions"
          description="Check your connection and try again."
          action={
            <Button iconLeft="refresh" disabled={isFetching} onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      </div>
    )
  } else {
    content = <TransactionListSkeleton />
  }

  const showFooter = transactions !== undefined && transactions.length > 0 && !isPastLastPage
  const first = (page - 1) * PAGE_SIZE + 1
  const selected: Transaction | undefined = transactions?.find((tx) => tx.id === txn)

  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Transactions</h1>
        <p className={styles.subtitle} aria-live="polite">
          {subtitle}
        </p>
      </header>

      <TransactionFilters
        q={q}
        type={type}
        status={status}
        onSearch={(value) => update({ q: value, page: 1 }, 'replace')}
        onTypeChange={(value) => update({ type: value, page: 1 })}
        onStatusChange={(value) => update({ status: value, page: 1 })}
        onClear={clearFilters}
      />

      <Card padding="none" as="div" className={isPlaceholderData ? styles.stale : undefined}>
        <div aria-busy={isPlaceholderData}>{content}</div>
      </Card>

      {showFooter && (
        <footer className={styles.footer}>
          <p className={styles.range}>
            Showing {count.format(first)} to {count.format(first + transactions.length - 1)} of{' '}
            {count.format(total)}
          </p>
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />}
        </footer>
      )}

      <Drawer open={txn !== null} title="Transaction details" onClose={() => update({ txn: null })}>
        {txn !== null && (
          <TransactionDetails
            key={txn}
            id={txn}
            initialData={selected}
            onClose={() => update({ txn: null })}
          />
        )}
      </Drawer>
    </div>
  )
}

/** Shown while the client reads the URL. Keeps the heading in place so the page does not jump. */
export function TransactionsFallback() {
  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Transactions</h1>
        <p className={styles.subtitle}>{' '}</p>
      </header>
      <Card padding="none" as="div">
        <TransactionListSkeleton />
      </Card>
    </div>
  )
}
