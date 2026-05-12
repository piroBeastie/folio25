import { useRef, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import './Details.css'

const albumModules = import.meta.glob('/public/creative/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' })
const ALBUMS = Object.values(albumModules)

const BACK_TEXT = 'BACK ←'

const isMobile = () => window.innerWidth < 768

function Details() {
  const prevIdx = useRef(0)
  const currentSrc = useRef(ALBUMS[0])
  const cloneRef = useRef(null)
  const overlayRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    ALBUMS.forEach((src) => { new Image().src = src })
  }, [])

  useEffect(() => {
    if (!isMobile() || ALBUMS.length === 0) return
    const clone = cloneRef.current
    if (!clone) return

    let idx = 0
    clone.style.backgroundImage = `url('${ALBUMS[0]}')`
    gsap.set(clone, { opacity: 1 })

    const cycle = () => {
      idx = (idx + 1) % ALBUMS.length
      gsap.to(clone, {
        opacity: 0, duration: 0.4, ease: 'power2.in',
        onComplete: () => {
          clone.style.backgroundImage = `url('${ALBUMS[idx]}')`
          gsap.to(clone, { opacity: 1, duration: 0.5, ease: 'power2.out' })
        },
      })
    }

    const interval = setInterval(cycle, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleHover = useCallback(() => {
    const clone = cloneRef.current
    if (!clone) return

    let idx = Math.floor(Math.random() * ALBUMS.length)
    if (idx === prevIdx.current && ALBUMS.length > 1) idx = (idx + 1) % ALBUMS.length
    prevIdx.current = idx
    currentSrc.current = ALBUMS[idx]

    clone.style.backgroundImage = `url('${ALBUMS[idx]}')`
    gsap.killTweensOf(clone)
    gsap.fromTo(clone, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' })
  }, [])

  const handleLeave = useCallback(() => {
    const clone = cloneRef.current
    if (!clone) return
    gsap.killTweensOf(clone)
    gsap.to(clone, { opacity: 0, duration: 0.35, ease: 'power2.in' })
  }, [])

  const open = useCallback(() => {
    const overlay = overlayRef.current
    const card = cardRef.current
    if (!overlay) return

    overlay.style.display = 'flex'
    if (window.__lenis) window.__lenis.stop()

    const img = card?.querySelector('img')
    if (img) img.src = currentSrc.current

    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
    gsap.fromTo(card,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }
    )
  }, [])

  const close = useCallback(() => {
    const overlay = overlayRef.current
    gsap.to(cardRef.current, { opacity: 0, scale: 0.8, duration: 0.3, ease: 'power2.in' })
    gsap.to(overlay, {
      opacity: 0, duration: 0.35, delay: 0.1, ease: 'power2.in',
      onComplete: () => {
        overlay.style.display = 'none'
        if (window.__lenis) window.__lenis.start()
      },
    })
  }, [])

  const handleOverlayClick = useCallback((e) => {
    if (!e.target.closest('.albumCard')) close()
  }, [close])

  return (
    <div id="details">
      <p>Independent</p>
      <p>
        <span
          className="creativeWord"
          role={isMobile() ? undefined : 'button'}
          onClick={isMobile() ? undefined : open}
          onMouseEnter={isMobile() ? undefined : handleHover}
          onMouseLeave={isMobile() ? undefined : handleLeave}
        >
          Creative
          <span className="creativeClone" ref={cloneRef} aria-hidden="true">Creative</span>
        </span>
        {' Developer'}
      </p>

      <div
        className="albumOverlay"
        ref={overlayRef}
        style={{ display: 'none' }}
        onClick={handleOverlayClick}
        onWheel={(e) => e.preventDefault()}
      >
        <button className="albumBack footerBackTop" onClick={close} type="button">
          {Array.from(BACK_TEXT).map((char, i) => (
            <span key={i} className="letterWrapper" style={{ '--delay': `${i * 0.03}s` }}>
              <span className="letterStack">
                <span>{char === ' ' ? ' ' : char}</span>
                <span>{char === ' ' ? ' ' : char}</span>
              </span>
            </span>
          ))}
        </button>
        <div className="albumCenter">
          <div className="albumCard" ref={cardRef}>
            <img src="" alt="Album cover" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details
