import { applyUrlState, parseUrlState } from './urlState'

const parse = (search: string) => parseUrlState(new URLSearchParams(search))

describe('parseUrlState', () => {
  it('uses defaults for an empty query string', () => {
    expect(parse('')).toEqual({ q: '', type: null, status: null, page: 1, txn: null })
  })

  it('reads every parameter', () => {
    expect(parse('q=netflix&type=card_payment&status=failed&page=3&txn=txn_255s')).toEqual({
      q: 'netflix',
      type: 'card_payment',
      status: 'failed',
      page: 3,
      txn: 'txn_255s',
    })
  })

  it('ignores values the API would not understand', () => {
    expect(parse('type=refund&status=reversed')).toMatchObject({ type: null, status: null })
    expect(parse('type=toString')).toMatchObject({ type: null })
  })

  it.each(['0', '-2', '1.5', 'abc', ''])('falls back to the first page for page=%s', (page) => {
    expect(parse(`page=${page}`).page).toBe(1)
  })
})

describe('applyUrlState', () => {
  const apply = (search: string, patch: Parameters<typeof applyUrlState>[1]) =>
    applyUrlState(new URLSearchParams(search), patch).toString()

  it('writes changed values', () => {
    expect(apply('', { status: 'pending', page: 2 })).toBe('status=pending&page=2')
  })

  it('removes parameters that are back at their default', () => {
    expect(apply('q=netflix&type=deposit&page=4&txn=txn_1', { q: '', type: null, page: 1, txn: null })).toBe(
      ''
    )
  })

  it('keeps parameters it does not own', () => {
    expect(apply('__scenario=slow&page=2', { page: 3 })).toBe('__scenario=slow&page=3')
  })
})
