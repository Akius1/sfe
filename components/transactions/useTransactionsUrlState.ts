'use client'
import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { applyUrlState, parseUrlState, type TransactionsUrlState } from './urlState'

type HistoryMode = 'push' | 'replace'

/**
 * URL-backed state for the Transactions page.
 *
 * Writes go through the History API, which Next keeps in sync with `useSearchParams`. Unlike `router.push`
 * this does not ask the server to render the route again for what is purely client-side state.
 */
export function useTransactionsUrlState() {
  const searchParams = useSearchParams()
  const state = useMemo(() => parseUrlState(new URLSearchParams(searchParams.toString())), [searchParams])

  const update = useCallback((patch: Partial<TransactionsUrlState>, mode: HistoryMode = 'push') => {
    // Read the live location: `searchParams` can lag behind a write made earlier in the same tick.
    const current = new URLSearchParams(window.location.search)
    const next = applyUrlState(current, patch)
    if (next.toString() === current.toString()) return

    const query = next.toString()
    const url = query ? `?${query}` : window.location.pathname
    if (mode === 'push') window.history.pushState(null, '', url)
    else window.history.replaceState(null, '', url)
  }, [])

  return { state, update }
}
