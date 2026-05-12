import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Name from './components/Name'
import Scrollable from './components/Scrollable'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const theme = 'dark'

  const cursorRef = useRef(null)
  const lastMouse = useRef({ x: 0, y: 0 })
  const scrollHovered = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const setCursor = (size) => gsap.to(cursor, { width: size, height: size, duration: 0.2, ease: 'power2.out', overwrite: 'auto' })

    const onMove = (e) => {
      lastMouse.current = { x: e.clientX, y: e.clientY }
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
    }

    const onOver = (e) => {
      const target = e.target.closest('a, button, [role="button"]')
      if (target === scrollHovered.current) return
      if (scrollHovered.current) scrollHovered.current.classList.remove('hovered')
      if (target) target.classList.add('hovered')
      scrollHovered.current = target || null
      setCursor(target ? 30 : 20)
    }

    const onOut = (e) => {
      const target = e.target.closest('a, button, [role="button"]')
      if (!target) return
      const related = e.relatedTarget?.closest('a, button, [role="button"]')
      if (related === target) return
      target.classList.remove('hovered')
      if (scrollHovered.current === target) scrollHovered.current = null
      setCursor(related ? 30 : 20)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  useEffect(() => {
    const fontsReady =
      document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve()

    fontsReady.then(() => {
      // ── Smooth scroll (Lenis + GSAP ticker) ───────────────────────
      const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      window.__lenis = lenis
      lenis.on('scroll', () => {
        ScrollTrigger.update()
        const { x, y } = lastMouse.current
        if (!x && !y) return
        const el = document.elementFromPoint(x, y)
        const target = el?.closest('a, button, [role="button"]') || null
        if (target !== scrollHovered.current) {
          const opts = { clientX: x, clientY: y, bubbles: true }
          if (scrollHovered.current) scrollHovered.current.dispatchEvent(new MouseEvent('mouseout', { ...opts, relatedTarget: target }))
          if (target) target.dispatchEvent(new MouseEvent('mouseover', { ...opts, relatedTarget: scrollHovered.current }))
          scrollHovered.current = target
        }
      })
      const rafFn = (time) => lenis.raf(time * 1000)
      gsap.ticker.add(rafFn)
      gsap.ticker.lagSmoothing(0)
      lenis.stop()

      // ── Loader element refs ───────────────────────────────────────
      const loader = document.getElementById('loader')
      const letterN = document.getElementById('letterN')
      const letterC = document.getElementById('letterC')
      const fillAnak = document.getElementById('fillAnak')
      const fillHahal = document.getElementById('fillHahal')

      // ── Responsive sizing ─────────────────────────────────────────
      const w = window.innerWidth
      const isMobile = w < 768
      const initialLoaderSize = Math.min(w * 0.13, 240)
      const finalLoaderSize = isMobile ? 18 : 24
      const finalLoaderPos = isMobile ? 12 : 20

      // Force explicit font-size on every loader element so the
      // global `*` rule can't override the cascade and break measurements.
      const loaderEls = [loader, letterN, fillAnak, letterC, fillHahal]
      loaderEls.forEach((el) => {
        el.style.fontSize = initialLoaderSize + 'px'
      })

      // ── Measure natural fill widths ───────────────────────────────
      fillAnak.style.width = 'auto'
      fillHahal.style.width = 'auto'
      const fillAnakWidth = fillAnak.offsetWidth
      const fillHahalWidth = fillHahal.offsetWidth
      fillAnak.style.width = '0px'
      fillHahal.style.width = '0px'
      const letterNWidth = letterN.offsetWidth

      // ── Loader animation values (px-based) ────────────────────────
      // Mobile starts expanded (nanakchahal) and shrinks to nc.
      // Desktop starts at nc and expands to nanakchahal.
      const initialFillAnak = isMobile ? fillAnakWidth : 0
      const initialFillHahal = isMobile ? fillHahalWidth : 0
      const targetFillAnak = isMobile ? 0 : fillAnakWidth
      const targetFillHahal = isMobile ? 0 : fillHahalWidth

      // Loader.left positions that keep `c` pinned at viewport center
      const initialLoaderLeft = w * 0.5 - (letterNWidth + initialFillAnak)
      const phase2EndLeft = w * 0.5 - (letterNWidth + targetFillAnak)

      // Fill widths scaled to the final font-size (desktop only)
      const fillAnakAtFinal = (fillAnakWidth / initialLoaderSize) * finalLoaderSize
      const fillHahalAtFinal = (fillHahalWidth / initialLoaderSize) * finalLoaderSize

      // ── Initial states ────────────────────────────────────────────
      gsap.set(loader, {
        top: '50%',
        left: initialLoaderLeft + 'px',
        yPercent: -50,
        opacity: 0,
      })
      gsap.set(fillAnak, { width: initialFillAnak + 'px' })
      gsap.set(fillHahal, { width: initialFillHahal + 'px' })

      gsap.set('#content', { opacity: 0 })
      gsap.set('#details p', { opacity: 0, y: 50 })
      gsap.set('.projectPara', { opacity: 0, y: 50 })
      gsap.set('#connectDiv p', { opacity: 0, y: 50 })
      gsap.set('#footerYear', { opacity: 0, y: 120 })
      gsap.set('#footerLine', { scaleX: 0 })
      gsap.set('.footerBackTop', { opacity: 0, y: 20 })

      // ── Master timeline ───────────────────────────────────────────
      const tl = gsap.timeline()

      // 1. Fade loader in
      tl.to(loader, { opacity: 1, duration: 1.0, ease: 'power2.out' })

      // 2. Animate fills (parallel) + slide loader to keep `c` centered
      tl.to(
        [fillAnak, fillHahal],
        {
          width: (i) => [targetFillAnak, targetFillHahal][i] + 'px',
          duration: 1.3,
          ease: 'power2.inOut',
          delay: 0.6,
        }
      )
      tl.to(
        loader,
        { left: phase2EndLeft + 'px', duration: 1.3, ease: 'power2.inOut' },
        '<'
      )

      // 3. Shrink loader font-size + move to top-left
      tl.to(loaderEls, {
        fontSize: finalLoaderSize + 'px',
        duration: 1.5,
        ease: 'power2.inOut',
        delay: 0.6,
      })
      if (!isMobile) {
        tl.to(
          [fillAnak, fillHahal],
          {
            width: (i) => [fillAnakAtFinal, fillHahalAtFinal][i] + 'px',
            duration: 1.5,
            ease: 'power2.inOut',
          },
          '<'
        )
      }
      tl.to(
        loader,
        {
          top: finalLoaderPos + 'px',
          left: finalLoaderPos + 'px',
          yPercent: 0,
          duration: 1.5,
          ease: 'power2.inOut',
        },
        '<'
      )

      // 4. Reveal main content
      tl.to(
        '#content',
        {
          opacity: 1,
          duration: 0.9,
          ease: 'expo.out',
          onStart: () => lenis.start(),
        },
        '-=0.7'
      )

      // 5. Stagger reveal details / projects / connect
      tl.to(
        '#details p',
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.18, ease: 'expo.out' },
        '-=0.5'
      )
      tl.to(
        '.projectPara',
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out' },
        '-=0.9'
      )
      tl.to(
        '#connectDiv p',
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'expo.out' },
        '-=0.7'
      )

      // ── Footer scroll-triggered animations ────────────────────────
      gsap.to('#footerLine', {
        scaleX: 1,
        duration: 1.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: '#footerDiv', start: 'top 70%' },
      })

      gsap.to('.footerBackTop', {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.15,
        ease: 'expo.out',
        scrollTrigger: { trigger: '#footerDiv', start: 'top 75%' },
      })

      // Year: scroll-trigger on desktop, in-timeline on mobile (40vh footer)
      if (isMobile) {
        tl.to(
          '#footerYear',
          { opacity: 1, y: 0, duration: 1.4, ease: 'expo.out' },
          '-=0.3'
        )
      } else {
        gsap.to('#footerYear', {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: '#footerDiv', start: 'top center' },
        })
      }

      // ── Cleanup ───────────────────────────────────────────────────
      return () => {
        gsap.ticker.remove(rafFn)
        lenis.destroy()
        ScrollTrigger.getAll().forEach((t) => t.kill())
      }
    })
  }, [])

  return (
    <div className={theme}>
      <div ref={cursorRef} id="custom-cursor" />
      <Name />
      <div id="content">
        <Scrollable />
        <div className={theme === 'light' ? 'dark' : 'light'}>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default App
