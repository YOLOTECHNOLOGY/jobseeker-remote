'use client'
import React, {useEffect} from 'react'

const Tracker = () => {
    useEffect(() => {
      const gtag = (window as any)?.gtag;

      if (process.env.ENV === 'production' && gtag) {
        gtag('event', 'home_page_view')
      }
    }, [])
    
    return <></>
}

export default Tracker