import { useState } from 'react'

const focusStyle = {
  border: '1px solid #16181D',
  background: '#fff',
  boxShadow: '0 0 0 3px rgba(22,24,29,0.07)',
}

// Input that applies the design's style-focus ring on focus.
export default function FocusInput({ style, ...rest }) {
  const [f, setF] = useState(false)
  return (
    <input
      {...rest}
      onFocus={(e) => { setF(true); rest.onFocus?.(e) }}
      onBlur={(e) => { setF(false); rest.onBlur?.(e) }}
      style={{ ...style, ...(f ? focusStyle : null) }}
    />
  )
}
