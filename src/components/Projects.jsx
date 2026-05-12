import { useRef, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import './Projects.css'
import data from './projectsData.js'

function Projects() {
  const imgARef = useRef(null)
  const imgBRef = useRef(null)
  const wrapRef = useRef(null)
  const activeKey = useRef(null)
  const isVisible = useRef(false)
  const frontRef = useRef('A')

  useEffect(() => {
    data.forEach((proj) => { new Image().src = proj.image })
  }, [])

  const getFront = () => frontRef.current === 'A' ? imgARef.current : imgBRef.current
  const getBack = () => frontRef.current === 'A' ? imgBRef.current : imgARef.current

  const getYPos = (el) => {
    const r = el.getBoundingClientRect()
    const p = el.closest('#projectRefs').getBoundingClientRect()
    const h = wrapRef.current.offsetHeight
    return r.top - p.top + r.height / 2 - h / 2
  }

  const handleEnter = useCallback((proj, e) => {
    activeKey.current = proj.key
    const wrap = wrapRef.current
    if (!wrap) return

    if (isVisible.current) {
      const yPos = getYPos(e.currentTarget)
      const incoming = getBack()
      const outgoing = getFront()

      incoming.src = proj.image
      incoming.alt = proj.name
      gsap.killTweensOf([wrap, incoming, outgoing])
      gsap.set(incoming, { zIndex: 2, opacity: 0, x: 0 })
      gsap.set(outgoing, { zIndex: 1, x: 0 })

      gsap.to(wrap, { y: yPos, x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
      gsap.to(incoming, { opacity: 1, duration: 0.4, ease: 'power2.out' })
      gsap.to(outgoing, { opacity: 0, duration: 0.3, ease: 'power2.in' })

      frontRef.current = frontRef.current === 'A' ? 'B' : 'A'
    } else {
      const img = imgARef.current
      img.src = proj.image
      img.alt = proj.name
      frontRef.current = 'A'
      isVisible.current = true

      gsap.set(imgBRef.current, { opacity: 0 })
      gsap.killTweensOf([wrap, img])
      gsap.set(wrap, { display: 'block' })
      const yPos = getYPos(e.currentTarget)
      gsap.set(wrap, { y: yPos })
      gsap.fromTo(wrap, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
      gsap.fromTo(img, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' })
    }
  }, [])

  const handleLeave = useCallback(() => {
    activeKey.current = null
    const wrap = wrapRef.current
    const front = getFront()
    if (!front || !wrap) return

    gsap.killTweensOf([wrap, imgARef.current, imgBRef.current])
    gsap.to(front, { opacity: 0, duration: 0.35, ease: 'power2.in' })
    gsap.to(wrap, {
      x: -30, opacity: 0, duration: 0.4, ease: 'power2.in',
      onComplete: () => {
        if (!activeKey.current) {
          gsap.set(wrap, { display: 'none', x: 0, opacity: 1 })
          gsap.set([imgARef.current, imgBRef.current], { x: 0, opacity: 0 })
          isVisible.current = false
        }
      },
    })
  }, [])

  return (
    <div id="projectRefs">
      <div className="projectPreviewWrap" ref={wrapRef} style={{ display: 'none' }}>
        <img className="projectPreview" ref={imgARef} src="" alt="" />
        <img className="projectPreview" ref={imgBRef} src="" alt="" />
      </div>
      {data.map((proj) => (
        <p className="projectPara" key={proj.key}>
          <a
            href={proj.link}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={(e) => handleEnter(proj, e)}
            onMouseLeave={handleLeave}
          >
            {proj.name}
          </a>
          <sup className="sup">({proj.year})</sup>
        </p>
      ))}
    </div>
  )
}

export default Projects
