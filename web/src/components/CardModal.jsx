import { useState } from 'react'
import FocusInput from './FocusInput.jsx'
import HoverButton from './HoverButton.jsx'

const label = { display: 'block', fontSize: 12.5, fontWeight: 600, color: '#6A6F78', marginBottom: 6 }
const field = { width: '100%', padding: '12px 14px', border: '1px solid #E2E4E9', borderRadius: 12, fontSize: 15, color: '#16181D', background: '#FBFBFC', outline: 'none' }

export default function CardModal({ initial, isEditing, onClose, onSubmit, onDelete }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')

  const set = (k, v) => { setForm((s) => ({ ...s, [k]: v })); setError('') }

  function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) return setError('Please enter a card name.')
    if (!form.bank.trim()) return setError('Please enter a bank.')
    if (form.miles === '' || isNaN(Number(form.miles)) || Number(form.miles) < 0) return setError('Please enter a valid miles amount.')
    if (!form.expiry) return setError('Please choose an expiry date.')
    onSubmit({
      name: form.name.trim(),
      bank: form.bank.trim(),
      miles: Math.round(Number(form.miles)),
      last4: (form.last4 || '').slice(0, 4),
      expiry: form.expiry,
    }).catch((err) => setError(err.message))
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(20,22,30,0.45)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} style={{ background: '#fff', width: '100%', maxWidth: 460, borderRadius: 24, padding: '22px 22px 20px', boxShadow: '0 28px 70px rgba(16,18,29,0.34)', maxHeight: '92vh', overflow: 'auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>{isEditing ? 'Edit card' : 'Add card'}</div>
          <HoverButton type="button" onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 9, border: '1px solid #ECEDF0', background: '#fff', color: '#6A6F78', fontSize: 18, lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            hover={{ background: '#F6F7F8' }}
          >×</HoverButton>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={label}>Card name</label>
          <FocusInput value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Voyage Infinite" style={field} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={label}>Bank</label>
          <FocusInput value={form.bank} onChange={(e) => set('bank', e.target.value)} placeholder="e.g. Aurora Bank" style={field} />
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1.5 }}>
            <label style={label}>Miles / points</label>
            <FocusInput value={form.miles} onChange={(e) => set('miles', e.target.value)} type="number" inputMode="numeric" placeholder="0" style={field} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={label}>Last 4 digits</label>
            <FocusInput value={form.last4} onChange={(e) => set('last4', e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" placeholder="1234" maxLength={4} style={{ ...field, letterSpacing: '0.06em' }} />
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={label}>Expiry date</label>
          <FocusInput value={form.expiry} onChange={(e) => set('expiry', e.target.value)} type="date" style={field} />
        </div>

        {error && (
          <div style={{ fontSize: 12.5, color: '#D03A3F', background: '#FDF3F3', border: '1px solid #F4DADC', borderRadius: 10, padding: '9px 12px', marginTop: 12 }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          {isEditing && (
            <HoverButton type="button" onClick={onDelete}
              style={{ background: '#fff', color: '#D03A3F', border: '1px solid #F1D2D4', borderRadius: 12, padding: '13px 16px', fontSize: 14.5, fontWeight: 600, cursor: 'pointer' }}
              hover={{ background: '#FDF3F3' }}
            >Delete</HoverButton>
          )}
          <HoverButton type="button" onClick={onClose}
            style={{ flex: 1, background: '#fff', color: '#16181D', border: '1px solid #E2E4E9', borderRadius: 12, padding: '13px 16px', fontSize: 14.5, fontWeight: 600, cursor: 'pointer' }}
            hover={{ background: '#F7F8F9' }}
          >Cancel</HoverButton>
          <HoverButton type="submit"
            style={{ flex: 1, background: '#16181D', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 16px', fontSize: 14.5, fontWeight: 600, cursor: 'pointer' }}
            hover={{ background: '#000' }}
          >Save card</HoverButton>
        </div>

      </form>
    </div>
  )
}
