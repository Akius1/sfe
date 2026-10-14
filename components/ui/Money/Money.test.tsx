import { render } from '@testing-library/react'
import { Money } from './Money'

describe('Money', () => {
  it('keeps both decimals and groups thousands regardless of the runtime locale', () => {
    const { container } = render(<Money amount={150050} currency="NGN" />)
    expect(container).toHaveTextContent('₦1,500.50')
  })

  it('does not lose precision on very large amounts', () => {
    const { container } = render(<Money amount={249999999999} currency="NGN" sign="credit" />)
    expect(container).toHaveTextContent('+₦2,499,999,999.99')
  })

  it('prefixes debits with a minus sign', () => {
    const { container } = render(<Money amount={4599} currency="USD" sign="debit" />)
    expect(container).toHaveTextContent('−$45.99')
  })
})
