import { getPageItems } from './getPageItems'

describe('getPageItems', () => {
  it('lists every page when there are only a few', () => {
    expect(getPageItems(1, 1)).toEqual([1])
    expect(getPageItems(2, 4)).toEqual([1, 2, 3, 4])
  })

  it('keeps three pages at the start and collapses the rest', () => {
    expect(getPageItems(1, 12)).toEqual([1, 2, 3, 'gap', 12])
  })

  it('shows the neighbours of a page in the middle', () => {
    expect(getPageItems(6, 12)).toEqual([1, 'gap', 5, 6, 7, 'gap', 12])
  })

  it('keeps three pages at the end', () => {
    expect(getPageItems(12, 12)).toEqual([1, 'gap', 10, 11, 12])
  })

  it('shows the page itself rather than a gap that would hide a single page', () => {
    expect(getPageItems(3, 12)).toEqual([1, 2, 3, 4, 'gap', 12])
    expect(getPageItems(10, 12)).toEqual([1, 'gap', 9, 10, 11, 12])
  })
})
