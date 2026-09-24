import './Name.css'

// Once settled in the corner, the mark doubles as "back to top".
const scrollToTop = () => {
  if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.5 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Spans must be on a single line so JSX doesn't insert whitespace
// between them — the loader text "nanakchahal" must render seamlessly.
function Name() {
  return (
    <div
      id="loader"
      role="button"
      tabIndex={0}
      aria-label="Nanak Chahal — back to top"
      onClick={scrollToTop}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToTop() } }}
    >
      <span id="letterN">n</span><span className="loaderFill" id="fillAnak">anak</span><span id="letterC">c</span><span className="loaderFill" id="fillHahal">hahal</span>
    </div>
  )
}

export default Name
