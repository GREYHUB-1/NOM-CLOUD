export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', opts)
  } catch {
    return iso
  }
}

export function formatDateShort(iso: string): string {
  return formatDate(iso, { month: 'short', day: 'numeric' })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCurrencyPrecise(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('')
}

export function timeAgo(iso: string): string {
  const now = new Date().getTime()
  const then = new Date(iso).getTime()
  const diffMs = now - then
  const diffMins = Math.round(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.round(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDateShort(iso)
}

export function percentage(value: number, max: number): number {
  if (max === 0) return 0
  return Math.round((value / max) * 100)
}
