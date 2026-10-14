import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Transaction } from '@/types/api'
import { TransactionRow } from './TransactionRow'

const transaction: Transaction = {
  id: 'txn_1',
  reference: 'ACM-48213377',
  type: 'transfer_out',
  status: 'pending',
  currency: 'GHS',
  amount: 120000,
  fee: 1200,
  narration: 'Transfer to Kwame Mensah',
  counterparty: 'Kwame Mensah',
  createdAt: '2026-10-05T10:15:00.000Z',
}

describe('TransactionRow', () => {
  it('shows the type, narration, status and a signed amount in the transaction currency', () => {
    render(<TransactionRow transaction={transaction} />)

    const row = screen.getByRole('button')
    expect(row).toHaveTextContent('Transfer out')
    expect(row).toHaveTextContent('Transfer to Kwame Mensah')
    expect(row).toHaveTextContent('Pending')
    expect(row).toHaveTextContent('−GH₵1,200.00')
  })

  it('renders markup in the narration as plain text', () => {
    const narration = 'Bill payment <img src="x" onerror="alert(1)">'
    render(<TransactionRow transaction={{ ...transaction, narration }} />)

    expect(screen.getByText(narration)).toBeInTheDocument()
    expect(document.querySelector('img')).toBeNull()
  })

  it('reports the selected transaction', async () => {
    const onSelect = vi.fn()
    render(<TransactionRow transaction={transaction} onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('button'))

    expect(onSelect).toHaveBeenCalledWith(transaction)
  })
})
