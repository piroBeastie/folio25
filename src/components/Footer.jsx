import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './Footer.css'

const formatIST = () =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())

function Footer() {
  const [time, setTime] = useState(formatIST)
  const markRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setTime(formatIST()), 15000)
    return () => clearInterval(id)
  }, [])

  // Scale the wordmark so it spans the full footer width edge to edge
  useLayoutEffect(() => {
    const mark = markRef.current
    if (!mark) return
    const fit = () => {
      const target = mark.parentElement.clientWidth - 2 * parseFloat(getComputedStyle(mark).paddingLeft)
      mark.style.fontSize = '100px'
      mark.style.fontSize = (100 * target) / mark.firstChild.getBoundingClientRect().width + 'px'
    }
    fit()
    document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <div id="footerDiv">
      <div id="footerTopBar">
        <p className="footerItem footerMeta">
          India <span className="footerDot">·</span> {time} IST
        </p>
        <p className="footerItem footerMeta">© 2026</p>
      </div>
      <div id="footerLine"></div>
      <p id="footerWordmark" ref={markRef} aria-hidden="true">
        <span>nanakchahal</span>
      </p>
    </div>
  )
}

export default Footer
