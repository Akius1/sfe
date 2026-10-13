import type { Transaction } from '@/types/api'
import { formatRelativeDay } from '@/lib/format'

export interface TransactionGroup {
  label: string
  transactions: Transaction[]
}

/** Splits a list that is already sorted by date into consecutive per-day groups. */
export function groupByDay(transactions: readonly Transaction[], now: Date = new Date()): TransactionGroup[] {
  const groups: TransactionGroup[] = []
  for (const transaction of transactions) {
    const label = formatRelativeDay(transaction.createdAt, now)
    const current = groups.at(-1)
    if (current?.label === label) current.transactions.push(transaction)
    else groups.push({ label, transactions: [transaction] })
  }
  return groups
}
