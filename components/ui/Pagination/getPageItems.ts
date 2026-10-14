export type PageItem = number | 'gap'

/**
 * Pages to offer for a given position: the first page, the last page and a window of three around the
 * current one. A run of skipped pages collapses into a single 'gap'.
 */
export function getPageItems(page: number, totalPages: number): PageItem[] {
  const windowStart = Math.max(1, Math.min(page - 1, totalPages - 2))
  const pages = [1, windowStart, windowStart + 1, windowStart + 2, totalPages].filter(
    (p) => p >= 1 && p <= totalPages
  )

  const items: PageItem[] = []
  let previous = 0
  for (const current of [...new Set(pages)].sort((a, b) => a - b)) {
    // A gap that would hide exactly one page shows that page instead.
    if (current - previous === 2) items.push(previous + 1)
    else if (current - previous > 2) items.push('gap')
    items.push(current)
    previous = current
  }
  return items
}
