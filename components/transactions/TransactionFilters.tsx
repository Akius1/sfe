'use client'
import { useEffect, useEffectEvent, useState } from 'react'
import type { TransactionStatus, TransactionType } from '@/types/api'
import { Button, Input, Select, type SelectOption } from '@/components/ui'
import { TRANSACTION_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import styles from './TransactionFilters.module.css'

const SEARCH_DEBOUNCE_MS = 300

const toOptions = (allLabel: string, labels: Record<string, string>): SelectOption[] => [
  { value: '', label: allLabel },
  ...Object.entries(labels).map(([value, label]) => ({ value, label })),
]

const TYPE_OPTIONS = toOptions('All types', TRANSACTION_TYPE_LABELS)
const STATUS_OPTIONS = toOptions('All statuses', TRANSACTION_STATUS_LABELS)

export interface TransactionFiltersProps {
  q: string
  type: TransactionType | null
  status: TransactionStatus | null
  onSearch: (q: string) => void
  onTypeChange: (type: TransactionType | null) => void
  onStatusChange: (status: TransactionStatus | null) => void
  onClear: () => void
}

export function TransactionFilters({
  q,
  type,
  status,
  onSearch,
  onTypeChange,
  onStatusChange,
  onClear,
}: TransactionFiltersProps) {
  const [draft, setDraft] = useState(q)
  // What we last sent up. It lets us tell our own search arriving back as `q` from an outside change.
  const [submitted, setSubmitted] = useState(q)
  const [previousQ, setPreviousQ] = useState(q)

  // `q` changed from outside (Back, Forward, Clear filters): the input follows it.
  if (q !== previousQ) {
    setPreviousQ(q)
    if (q !== submitted) {
      setDraft(q)
      setSubmitted(q)
    }
  }

  const submit = (value: string) => {
    setSubmitted(value)
    onSearch(value)
  }
  const submitDebounced = useEffectEvent(submit)

  useEffect(() => {
    const value = draft.trim()
    if (value === submitted) return
    const timeout = setTimeout(() => submitDebounced(value), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [draft, submitted])

  const hasFilters = draft.trim() !== '' || type !== null || status !== null

  return (
    <form
      role="search"
      className={styles.filters}
      onSubmit={(event) => {
        event.preventDefault()
        submit(draft.trim())
      }}
    >
      <Input
        label="Search"
        type="search"
        name="q"
        autoComplete="off"
        leadingIcon="search"
        placeholder="Search by reference, name or narration"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        fieldClassName={styles.search}
      />
      <Select
        label="Type"
        options={TYPE_OPTIONS}
        value={type ?? ''}
        onChange={(event) => onTypeChange((event.target.value || null) as TransactionType | null)}
      />
      <Select
        label="Status"
        options={STATUS_OPTIONS}
        value={status ?? ''}
        onChange={(event) => onStatusChange((event.target.value || null) as TransactionStatus | null)}
      />
      {hasFilters && (
        <Button
          variant="ghost"
          className={styles.clear}
          onClick={() => {
            setDraft('')
            setSubmitted('')
            onClear()
          }}
        >
          Clear filters
        </Button>
      )}
    </form>
  )
}
