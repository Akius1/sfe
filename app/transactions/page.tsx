import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TransactionsFallback, TransactionsView } from '@/components/transactions'

export const metadata: Metadata = { title: 'Transactions' }

export default function TransactionsPage() {
  // The view reads its state from the URL with useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense fallback={<TransactionsFallback />}>
      <TransactionsView />
    </Suspense>
  )
}
