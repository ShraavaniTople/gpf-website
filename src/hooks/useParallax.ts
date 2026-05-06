import { useEffect, useRef } from 'react'

export function useParallax(speed = 0.25) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleScroll = () => {
      const rect = el.getBoundingClientRect()
      const center = rect.top + rect.height / 2
      const offset = (window.innerHeight / 2 - center) * speed
      const img = el.querySelector('img') as HTMLImageElement | null
      if (img) {
        img.style.transform = `translateY(${offset}px) scale(1.15)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return ref
}
