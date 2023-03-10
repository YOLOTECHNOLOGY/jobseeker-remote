'use client'
import { useState, useEffect } from 'react'

/* Vendors */
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    googletag: any
  }
}

function useTransitionState() {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const setTransitionStarted = () => {
    setIsTransitioning(true)

    // destroy all ad slots
    const { googletag } = window
    if (googletag) {
      googletag.cmd.push(function () {
        googletag.destroySlots()
      })
    }
  }

  const setTransitionComplete = () => {
    setIsTransitioning(false)
  }
  useEffect(() => {
    // if route change, set to true
    // router.events.on('routeChangeStart', setTransitionStarted)
    // router.events.on('routeChangeComplete', setTransitionComplete)
    // return () => {
    //   router.events.off('routeChangeStart', setTransitionStarted)
    //   router.events.off('routeChangeComplete', setTransitionComplete)
    // }
    setTransitionStarted()
    setTransitionComplete()
  }, [pathname])

  return isTransitioning
}

export default useTransitionState
