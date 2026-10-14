const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' })

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** "Wed, 30 Sep 2026" */
export const formatDate = (iso: string) => dateFormatter.format(new Date(iso))

/** "14:22" */
export const formatTime = (iso: string) => timeFormatter.format(new Date(iso))

/** "Wed, 30 Sep 2026, 14:22" */
export const formatDateTime = (iso: string) => dateTimeFormatter.format(new Date(iso))

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

/** "Today", "Yesterday", otherwise "Wed, 30 Sep 2026". Days are calendar days in the viewer's time zone. */
export function formatRelativeDay(iso: string, now: Date = new Date()): string {
  const date = new Date(iso)
  // Rounding absorbs the 23 and 25 hour days around a DST change.
  const daysAgo = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000)
  if (daysAgo === 0) return 'Today'
  if (daysAgo === 1) return 'Yesterday'
  return dateFormatter.format(date)
}
