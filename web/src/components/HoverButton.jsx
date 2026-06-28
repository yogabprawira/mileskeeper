import { useState } from 'react'

// Button that merges `hover` styles on mouse-over, replacing the design's style-hover attr.
export default function HoverButton({ style, hover, children, ...rest }) {
  const [h, setH] = useState(false)
  return (
    <button
      {...rest}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ ...style, ...(h ? hover : null) }}
    >
      {children}
    </button>
  )
}
