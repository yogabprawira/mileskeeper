import HoverButton from './HoverButton.jsx'
import { UNIT_LABEL } from '../cards.js'

export default function CardItem({ card, onEdit, onDelete }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '1.586 / 1', boxShadow: '0 14px 34px -12px rgba(16,18,29,0.45)', color: '#fff' }}>
        <div style={{ position: 'absolute', inset: 0, background: card.gradient }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(118deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 38%), radial-gradient(130% 90% at 88% 6%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 50%)' }} />
        <div style={{ position: 'absolute', inset: 0, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' }}>{card.bank}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.72)', marginTop: 2 }}>{card.name}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.16)', padding: '5px 9px', borderRadius: 999 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: card.statusColor, boxShadow: `0 0 8px ${card.statusGlow}` }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.01em', color: 'rgba(255,255,255,0.95)' }}>{card.statusLabel}</span>
            </div>
          </div>

          <div style={{ width: 42, height: 31, borderRadius: 6, background: 'linear-gradient(135deg,#f6e6b6,#c9a44d)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.3)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 31%, rgba(0,0,0,0.16) 31%, rgba(0,0,0,0.16) 33%, transparent 33%), linear-gradient(to right, transparent 64%, rgba(0,0,0,0.16) 64%, rgba(0,0,0,0.16) 66%, transparent 66%), linear-gradient(to bottom, transparent 47%, rgba(0,0,0,0.16) 47%, rgba(0,0,0,0.16) 49%, transparent 49%)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.62)' }}>{UNIT_LABEL.toUpperCase()}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 600, lineHeight: 1.05 }}>{card.milesFmt}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.92)' }}>•••• {card.last4Display}</div>
              <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>EXP {card.expiryShort}</div>
            </div>
          </div>

        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 4px 0', gap: 10 }}>
        <div style={{ fontSize: 12.5, color: '#5B616B', minWidth: 0 }}>
          Expires {card.expiryFull} · <span style={{ color: card.statusColor, fontWeight: 600 }}>{card.statusLabel}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <HoverButton
            onClick={onEdit}
            style={{ background: '#fff', border: '1px solid #E4E6EB', color: '#3A3F47', borderRadius: 9, padding: '7px 13px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
            hover={{ border: '1px solid #C9CDD4', background: '#FAFAFB' }}
          >Edit</HoverButton>
          <HoverButton
            onClick={onDelete}
            style={{ background: '#fff', border: '1px solid #F1D2D4', color: '#D03A3F', borderRadius: 9, padding: '7px 13px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
            hover={{ background: '#FDF3F3', border: '1px solid #E9B9BC' }}
          >Delete</HoverButton>
        </div>
      </div>
    </div>
  )
}
