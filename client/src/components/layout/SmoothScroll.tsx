import { useEffect, type PropsWithChildren } from 'react'
import Lenis from 'lenis'

export function SmoothScroll({ children }: PropsWithChildren) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      lerp: 0.1,
      smoothWheel: true,
    })

    return () => lenis.destroy()
  }, [])

  return children
}
