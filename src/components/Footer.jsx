import './Footer.css'

const BACK_TO_TOP_TEXT = 'BACK TO TOP ↑'

function Footer() {
  return (
    <div id="footerDiv">
      <div id="footerTopBar">
        <button className="footerBackTop" type="button">
          {Array.from(BACK_TO_TOP_TEXT).map((char, i) => (
            <span
              key={i}
              className="letterWrapper"
              style={{ '--delay': `${i * 0.03}s` }}
            >
              <span className="letterStack">
                <span>{char === ' ' ? ' ' : char}</span>
                <span>{char === ' ' ? ' ' : char}</span>
              </span>
            </span>
          ))}
        </button>
      </div>
      <div id="footerLine"></div>
      <p id="footerYear">2026</p>
    </div>
  )
}

export default Footer
