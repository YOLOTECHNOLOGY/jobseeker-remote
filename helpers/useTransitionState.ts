import { useState, useEffect } from 'react'

/* Vendors */
import { useRouter } from 'next/router'

declare global {
  interface Window {
    googletag: any;
  }
}

function useTransitionState() {
  const router = useRouter()

  const [isTransitioning, setIsTransitioning] = useState(false)

  const setTransitionStarted = () => {
    setIsTransitioning(true)

    // destroy all ad slots
    const { googletag } = window
    console.log('googletag', googletag)
    if (googletag){
      googletag.cmd.push(function () {
        googletag.destroySlots()
      })
      console.log('triggered destroySlots')
    }
  }

  const setTransitionComplete = () => {
    setIsTransitioning(false)
  }
  useEffect(() => {
    // if route change, set to true
    router.events.on('routeChangeStart', setTransitionStarted)
    router.events.on('routeChangeComplete', setTransitionComplete)

    return () => {
      router.events.off('routeChangeStart', setTransitionStarted)
      router.events.off('routeChangeComplete', setTransitionComplete)
    }
  }, [])

  return isTransitioning
}

export default useTransitionState