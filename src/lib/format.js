export function formatUSD(amount) {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(d, opts) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(
    'en-IN',
    opts || { day: '2-digit', month: 'short', year: 'numeric' }
  )
}

export function tierLabel(tier) {
  if (!tier) return '—'
  return `${tier}-Tier`
}
