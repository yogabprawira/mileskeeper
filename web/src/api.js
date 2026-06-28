// Thin REST client for the Go cards API.
const base = '/api/cards'

async function req(url, opts) {
  const res = await fetch(url, opts)
  if (!res.ok) {
    let msg = `request failed (${res.status})`
    try { msg = (await res.json()).error || msg } catch {}
    throw new Error(msg)
  }
  return res.status === 204 ? null : res.json()
}

export const listCards = () => req(base)
export const createCard = (card) =>
  req(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(card) })
export const updateCard = (id, card) =>
  req(`${base}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(card) })
export const deleteCard = (id) => req(`${base}/${id}`, { method: 'DELETE' })
