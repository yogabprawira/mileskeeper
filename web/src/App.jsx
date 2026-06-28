import { useEffect, useState } from 'react'
import * as api from './api.js'
import { decorate, summarize, UNIT_LABEL } from './cards.js'
import SummaryCard from './components/SummaryCard.jsx'
import CardItem from './components/CardItem.jsx'
import CardModal from './components/CardModal.jsx'
import HoverButton from './components/HoverButton.jsx'

const EMPTY_FORM = { name: '', bank: '', miles: '', last4: '', expiry: '' }

export default function App() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | { editingId, initial }

  useEffect(() => {
    api.listCards()
      .then(setCards)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  const openAdd = () => setModal({ editingId: null, initial: EMPTY_FORM })
  const openEdit = (c) => setModal({
    editingId: c.id,
    initial: { name: c.name, bank: c.bank, miles: String(c.miles), last4: c.last4 || '', expiry: c.expiry },
  })
  const closeModal = () => setModal(null)

  async function submit(payload) {
    if (modal.editingId) {
      const updated = await api.updateCard(modal.editingId, payload)
      setCards((cs) => cs.map((c) => (c.id === updated.id ? updated : c)))
    } else {
      const created = await api.createCard(payload)
      setCards((cs) => [...cs, created])
    }
    closeModal()
  }

  async function remove(id) {
    await api.deleteCard(id)
    setCards((cs) => cs.filter((c) => c.id !== id))
    closeModal()
  }

  const decorated = decorate(cards)
  const { urgent, soon, safe, total } = summarize(cards)

  return (
    <div style={{ minHeight: '100vh', background: '#F4F5F7', fontFamily: "'Manrope',sans-serif", color: '#16181D', WebkitFontSmoothing: 'antialiased' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '22px 18px 128px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 2px 18px' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#4B4FD6,#6E66E8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(75,79,214,0.3)' }}>
            <div style={{ width: 10, height: 10, background: '#fff', borderRadius: 2, transform: 'rotate(45deg)' }} />
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em' }}>MilesKeeper</div>
        </div>

        <SummaryCard total={total} unit={UNIT_LABEL} count={cards.length} urgent={urgent} soon={soon} safe={safe} />

        {!loading && cards.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '26px 2px 14px' }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Your cards</div>
              <div style={{ fontSize: 12, color: '#9AA0A8' }}>Sorted by expiry</div>
            </div>
            {decorated.map((c) => (
              <CardItem key={c.id} card={c} onEdit={() => openEdit(c)} onDelete={() => remove(c.id)} />
            ))}
          </div>
        )}

        {!loading && cards.length === 0 && (
          <div style={{ textAlign: 'center', padding: '54px 24px 40px' }}>
            <div style={{ width: 54, height: 54, borderRadius: 16, background: '#fff', border: '1px solid #EAECEF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 6px 18px -8px rgba(16,18,29,0.16)' }}>
              <div style={{ width: 22, height: 16, borderRadius: 4, background: 'linear-gradient(135deg,#4B4FD6,#6E66E8)' }} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>No cards yet</div>
            <div style={{ fontSize: 13.5, color: '#8A8F98', marginTop: 6, lineHeight: 1.5, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>
              Add your first card to start tracking miles and keep an eye on expiry dates.
            </div>
            <HoverButton onClick={openAdd}
              style={{ marginTop: 20, background: '#16181D', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 22px', fontSize: 14.5, fontWeight: 600, cursor: 'pointer' }}
              hover={{ background: '#000' }}
            >+ Add card</HoverButton>
          </div>
        )}

      </div>

      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', padding: '16px 18px calc(16px + env(safe-area-inset-bottom))', background: 'linear-gradient(to top, #F4F5F7 55%, rgba(244,245,247,0))', pointerEvents: 'none', zIndex: 30 }}>
        <HoverButton onClick={openAdd}
          style={{ pointerEvents: 'auto', width: '100%', maxWidth: 460, background: '#16181D', color: '#fff', border: 'none', borderRadius: 14, padding: 15, fontSize: 15.5, fontWeight: 600, cursor: 'pointer', boxShadow: '0 10px 28px rgba(22,24,29,0.22)' }}
          hover={{ background: '#000' }}
        >+ Add card</HoverButton>
      </div>

      {modal && (
        <CardModal
          initial={modal.initial}
          isEditing={!!modal.editingId}
          onClose={closeModal}
          onSubmit={submit}
          onDelete={() => remove(modal.editingId)}
        />
      )}
    </div>
  )
}
