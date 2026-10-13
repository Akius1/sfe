import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Drawer } from './Drawer'

describe('Drawer', () => {
  it('is a dialog named by its title', () => {
    render(
      <Drawer open title="Transaction details" onClose={() => {}}>
        Body
      </Drawer>
    )
    expect(screen.getByRole('dialog', { name: 'Transaction details' })).toBeInTheDocument()
  })

  it('is not exposed while closed', () => {
    render(
      <Drawer open={false} title="Transaction details" onClose={() => {}}>
        Body
      </Drawer>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes from the close button', async () => {
    const onClose = vi.fn()
    render(
      <Drawer open title="Transaction details" onClose={onClose}>
        Body
      </Drawer>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when the content is clicked', async () => {
    const onClose = vi.fn()
    render(
      <Drawer open title="Transaction details" onClose={onClose}>
        Body
      </Drawer>
    )

    await userEvent.click(screen.getByText('Body'))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('reports a native close such as Escape exactly once', () => {
    const onClose = vi.fn()
    const { rerender } = render(
      <Drawer open title="Transaction details" onClose={onClose}>
        Body
      </Drawer>
    )

    screen.getByRole<HTMLDialogElement>('dialog').close()
    expect(onClose).toHaveBeenCalledTimes(1)

    // The parent reacting by closing the drawer must not report a second close.
    rerender(
      <Drawer open={false} title="Transaction details" onClose={onClose}>
        Body
      </Drawer>
    )
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
