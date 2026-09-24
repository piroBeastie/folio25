import './RollingText.css'

// Each character is stacked twice; on `.hovered` the stack rolls up one line
// with a per-letter delay. Parent must toggle `.hovered` (App.jsx does this).
function RollingText({ text }) {
  return Array.from(text).map((char, i) => (
    <span
      key={i}
      className="letterWrapper"
      style={{ '--delay': `${i * 0.03}s` }}
    >
      <span className="letterStack">
        <span>{char === ' ' ? ' ' : char}</span>
        <span>{char === ' ' ? ' ' : char}</span>
      </span>
    </span>
  ))
}

export default RollingText
