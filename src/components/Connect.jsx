import { useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import connectData from './connectData.js'
import logos from './ConnectLogos.jsx'
import './Connect.css'

function Connect() {
  const wrapRef = useRef(null)
  const activeKey = useRef(null)
  const isVisible = useRef(false)

  // Vertical offset that centres the logo card on the hovered row
  const getYPos = (el) => {
    const r = el.getBoundingClientRect()
    const p = el.closest('#connectDiv').getBoundingClientRect()
    return r.top - p.top + r.height / 2 - wrapRef.current.offsetHeight / 2
  }

  const showLogo = (key) => {
    wrapRef.current.querySelectorAll('.connectLogo').forEach((el) => {
      el.classList.toggle('active', el.dataset.key === String(key))
    })
  }

  const handleEnter = useCallback((link, e) => {
    activeKey.current = link.key
    const wrap = wrapRef.current
    if (!wrap) return
    showLogo(link.key)

    gsap.killTweensOf(wrap)
    if (isVisible.current) {
      gsap.to(wrap, { y: getYPos(e.currentTarget), x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
    } else {
      isVisible.current = true
      gsap.set(wrap, { display: 'block' })
      gsap.set(wrap, { y: getYPos(e.currentTarget) })
      gsap.fromTo(wrap, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
    }
  }, [])

  const handleLeave = useCallback(() => {
    activeKey.current = null
    const wrap = wrapRef.current
    if (!wrap) return

    gsap.killTweensOf(wrap)
    gsap.to(wrap, {
      x: -30, opacity: 0, duration: 0.4, ease: 'power2.in',
      onComplete: () => {
        if (!activeKey.current) {
          gsap.set(wrap, { display: 'none', x: 0 })
          showLogo(null)
          isVisible.current = false
        }
      },
    })
  }, [])

  return (
    <div id="connectDiv">
      <div className="connectLogoWrap" ref={wrapRef} style={{ display: 'none' }} aria-hidden="true">
        {connectData.map((link) => (
          <div key={link.key} className={`connectLogo connectLogo--${link.logo}`} data-key={link.key}>
            {logos[link.logo]}
          </div>
        ))}
      </div>
      {connectData.map((link) => (
        <p key={link.name}>
          <a
            href={link.link}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={(e) => handleEnter(link, e)}
            onMouseLeave={handleLeave}
          >
            <span className="connectLabel">{link.name}</span>
            <svg className="connectArrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 17L17 7M17 7H8M17 7V16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </p>
      ))}
    </div>
  )
}

export default Connect
