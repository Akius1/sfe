import type { Transaction } from '@/types/api'
import { groupByDay } from './groupByDay'

const at = (id: string, date: Date): Transaction => ({
  id,
  reference: `ACM-${id}`,
  type: 'deposit',
  status: 'successful',
  currency: 'NGN',
  amount: 100000,
  fee: 0,
  narration: 'Wallet top-up via bank transfer',
  counterparty: null,
  createdAt: date.toISOString(),
})

describe('groupByDay', () => {
  // Built from local date parts so the test holds in any time zone.
  const now = new Date(2026, 9, 7, 15, 0)

  it('labels today and yesterday and falls back to the date', () => {
    const groups = groupByDay(
      [
        at('a', new Date(2026, 9, 7, 14, 22)),
        at('b', new Date(2026, 9, 7, 0, 5)),
        at('c', new Date(2026, 9, 6, 23, 59)),
        at('d', new Date(2026, 9, 5, 10, 15)),
      ],
      now
    )

    expect(groups.map((group) => [group.label, group.transactions.map((tx) => tx.id)])).toEqual([
      ['Today', ['a', 'b']],
      ['Yesterday', ['c']],
      ['Mon, 5 Oct 2026', ['d']],
    ])
  })

  it('returns no groups for an empty list', () => {
    expect(groupByDay([], now)).toEqual([])
  })
})
