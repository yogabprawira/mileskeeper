import { fmtMiles } from '../cards.js'

const dot = (color) => ({ width: 8, height: 8, borderRadius: '50%', background: color })
const stat = { fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 600 }
const statLabel = { fontSize: 11.5, color: '#9097A0', marginTop: 4 }

export default function SummaryCard({ total, unit, count, urgent, soon, safe }) {
  return (
    <div style={{ background: '#fff', borderRadius: 22, padding: '22px 22px 20px', border: '1px solid #EDEEF1', boxShadow: '0 1px 2px rgba(16,18,29,0.04), 0 10px 30px -12px rgba(16,18,29,0.10)' }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#9097A0' }}>
        Total {unit}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 7 }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 44, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.02em' }}>
          {fmtMiles(total)}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#9097A0' }}>{unit}</div>
      </div>
      <div style={{ fontSize: 13, color: '#8A8F98', marginTop: 6 }}>
        across {count} {count === 1 ? 'card' : 'cards'}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 18, paddingTop: 16, borderTop: '1px solid #EEF0F2' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={dot('#E5484D')} />
            <span style={stat}>{urgent}</span>
          </div>
          <div style={statLabel}>Urgent</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={dot('#E0962A')} />
            <span style={stat}>{soon}</span>
          </div>
          <div style={statLabel}>Watch</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={dot('#2FA56A')} />
            <span style={stat}>{safe}</span>
          </div>
          <div style={statLabel}>Safe</div>
        </div>
      </div>
    </div>
  )
}
