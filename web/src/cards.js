// Card display logic ported from the original design prototype.

export const NEAR_THRESHOLD = 30 // days -> "urgent"
export const MID_THRESHOLD = 90  // days -> "soon"
export const UNIT_LABEL = 'miles' // 'miles' | 'points'

const GRADIENTS = [
  'linear-gradient(135deg,#283593 0%,#5b54c9 100%)',
  'linear-gradient(135deg,#0f5e57 0%,#1ea896 100%)',
  'linear-gradient(135deg,#26292f 0%,#4a5159 100%)',
  'linear-gradient(135deg,#5e1f3a 0%,#a13b5e 100%)',
  'linear-gradient(135deg,#14306b 0%,#2f6df0 100%)',
  'linear-gradient(135deg,#4a3520 0%,#9c7846 100%)',
  'linear-gradient(135deg,#3a1f5e 0%,#7a4fc9 100%)',
]

export function daysUntil(expiry) {
  if (!expiry) return Infinity
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d = new Date(expiry + 'T00:00:00')
  return Math.round((d - today) / 86400000)
}

export function statusFor(days) {
  if (days < 0) return { key: 'expired', color: '#E5484D', glow: 'rgba(229,72,77,0.7)', label: 'Expired' }
  if (days < NEAR_THRESHOLD) return { key: 'urgent', color: '#E5484D', glow: 'rgba(229,72,77,0.7)', label: days === 0 ? 'Today' : days + 'd left' }
  if (days <= MID_THRESHOLD) return { key: 'soon', color: '#E0962A', glow: 'rgba(224,150,42,0.7)', label: days + 'd left' }
  return { key: 'safe', color: '#2FA56A', glow: 'rgba(47,165,106,0.7)', label: days + 'd left' }
}

export function gradientFor(bank) {
  let h = 0
  const s = bank || ''
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return GRADIENTS[h % GRADIENTS.length]
}

export const fmtMiles = (n) => Number(n || 0).toLocaleString('en-US')

export function fmtFull(expiry) {
  if (!expiry) return ''
  const d = new Date(expiry + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function fmtMMYY(expiry) {
  if (!expiry) return '--/--'
  const d = new Date(expiry + 'T00:00:00')
  return String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getFullYear()).slice(2)
}

// Decorate a raw card with derived display fields, sorted by soonest expiry.
export function decorate(cards) {
  return [...cards]
    .sort((a, b) => daysUntil(a.expiry) - daysUntil(b.expiry))
    .map((c) => {
      const st = statusFor(daysUntil(c.expiry))
      return {
        ...c,
        gradient: gradientFor(c.bank),
        milesFmt: fmtMiles(c.miles),
        last4Display: c.last4 || '••••',
        expiryShort: fmtMMYY(c.expiry),
        expiryFull: fmtFull(c.expiry),
        statusColor: st.color,
        statusGlow: st.glow,
        statusLabel: st.label,
      }
    })
}

// Summary counts for the header card.
export function summarize(cards) {
  let urgent = 0, soon = 0, safe = 0
  for (const c of cards) {
    const k = statusFor(daysUntil(c.expiry)).key
    if (k === 'urgent' || k === 'expired') urgent++
    else if (k === 'soon') soon++
    else safe++
  }
  const total = cards.reduce((s, c) => s + Number(c.miles || 0), 0)
  return { urgent, soon, safe, total }
}
