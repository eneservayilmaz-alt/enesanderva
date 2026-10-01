import { useEffect } from 'react'
import './record-focus.css'

export function useRecordFocus(ready: boolean, prefix: string) {
  useEffect(() => {
    if (!ready) return
    const id = new URLSearchParams(window.location.search).get('focus')
    if (!id) return
    let frame = 0
    let timer = 0
    let target: HTMLElement | null = null
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    frame = requestAnimationFrame(() => {
      target = document.getElementById(`${prefix}${id}`)
      if (!target) return
      target.focus({ preventScroll: true })
      target.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'instant' : 'smooth' })
      const started = performance.now()
      const highlight = () => {
        if (!target) return
        const rect = target.getBoundingClientRect()
        // Start the three-second emphasis after the scroll reaches the record.
        if (!reduceMotion && Math.abs(rect.top + rect.height / 2 - innerHeight / 2) > 4 && performance.now() - started < 1500) {
          frame = requestAnimationFrame(highlight)
          return
        }
        target.classList.add('record-highlighted')
        timer = window.setTimeout(() => target?.classList.remove('record-highlighted'), 3000)
      }
      frame = requestAnimationFrame(highlight)
    })
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); target?.classList.remove('record-highlighted') }
  }, [ready, prefix])
}
