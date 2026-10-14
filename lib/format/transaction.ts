import type { TransactionStatus, TransactionType } from '@/types/api'

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  transfer_in: 'Transfer in',
  transfer_out: 'Transfer out',
  conversion: 'Conversion',
  card_payment: 'Card payment',
  bill_payment: 'Bill payment',
}

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  successful: 'Successful',
  pending: 'Pending',
  failed: 'Failed',
}

const CREDIT_TYPES: ReadonlySet<TransactionType> = new Set(['deposit', 'transfer_in', 'conversion'])

/** Whether the transaction adds money to the wallet it is recorded against. */
export const isCredit = (type: TransactionType) => CREDIT_TYPES.has(type)

/** "Kwame Mensah" -> "KM", "Okonkwo-Adeyemi Logistics" -> "OA". */
export function getInitials(name: string): string {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}
