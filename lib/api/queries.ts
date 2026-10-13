import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { Transaction } from '@/types/api'
import { getMe, getTransaction, getTransactions, type TransactionQuery } from './endpoints'

export const transactionKeys = {
  all: ['transactions'] as const,
  list: (query: TransactionQuery) => [...transactionKeys.all, 'list', query] as const,
  detail: (id: string) => [...transactionKeys.all, 'detail', id] as const,
}

/** The signed-in user. */
export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: ({ signal }) => getMe({ signal }).then((res) => res.data),
  })
}

/**
 * A page of transactions. While the next page or filter loads, the previous result stays available as
 * placeholder data. Each set of parameters has its own cache entry and superseded requests are aborted,
 * so a slow response can never overwrite a newer one.
 */
export function useTransactions(query: TransactionQuery) {
  return useQuery({
    queryKey: transactionKeys.list(query),
    queryFn: ({ signal }) => getTransactions(query, { signal }),
    placeholderData: keepPreviousData,
  })
}

/** A single transaction. Pass the row from the list as `initialData` to skip the request. */
export function useTransaction(id: string, initialData?: Transaction) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: ({ signal }) => getTransaction(id, { signal }).then((res) => res.data),
    initialData,
  })
}
