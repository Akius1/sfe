import type { TransactionStatus, TransactionType } from '@/types/api'
import { TRANSACTION_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/format'

/** Everything about the Transactions page that lives in the URL, so it survives refresh, share and Back. */
export interface TransactionsUrlState {
  q: string
  type: TransactionType | null
  status: TransactionStatus | null
  page: number
  /** Id of the transaction whose details are open. */
  txn: string | null
}

const isType = (value: string | null): value is TransactionType =>
  value !== null && Object.hasOwn(TRANSACTION_TYPE_LABELS, value)

const isStatus = (value: string | null): value is TransactionStatus =>
  value !== null && Object.hasOwn(TRANSACTION_STATUS_LABELS, value)

/** Reads the state from a query string. Anything missing or invalid falls back to its default. */
export function parseUrlState(params: URLSearchParams): TransactionsUrlState {
  const type = params.get('type')
  const status = params.get('status')
  const page = params.get('page') ?? ''

  return {
    q: params.get('q')?.trim() ?? '',
    type: isType(type) ? type : null,
    status: isStatus(status) ? status : null,
    page: /^[1-9]\d*$/.test(page) ? Number(page) : 1,
    txn: params.get('txn') || null,
  }
}

/**
 * Applies a partial change to a query string. Defaults are removed rather than written, so the bare
 * `/transactions` URL stays clean, and parameters this page does not own are left alone.
 */
export function applyUrlState(
  params: URLSearchParams,
  patch: Partial<TransactionsUrlState>
): URLSearchParams {
  const next = new URLSearchParams(params)
  for (const [key, value] of Object.entries(patch)) {
    const isDefault = value === null || value === '' || (key === 'page' && value === 1)
    if (isDefault) next.delete(key)
    else next.set(key, String(value))
  }
  return next
}
