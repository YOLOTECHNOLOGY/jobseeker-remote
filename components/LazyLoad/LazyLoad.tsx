import { useRef } from 'react'
import useIntersectionObserver from 'helpers/useIntersectionObserver'

interface LazyLoadProps {
  children: React.ReactNode
  style?:object
  className?: string
}

const LazyLoad = ({style, className, children }: LazyLoadProps) => {
  const containerRef = useRef()
  const lockRef = useRef(false)
  const entry = useIntersectionObserver(containerRef, {})
  if (entry && entry.isIntersecting) {
    lockRef.current = true
  }

  return (
    <div style={style} className={className} ref={containerRef}>
      {lockRef.current && (children)}
    </div>
  )
}

export default LazyLoad
