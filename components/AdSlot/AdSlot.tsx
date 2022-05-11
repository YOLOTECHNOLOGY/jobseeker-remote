import React, { useEffect } from 'react'
// import React, { memo } from 'react'

import useAdSlot from 'helpers/useAdSlot'
import useTransitionState from 'helpers/useTransitionState'
import ads from 'lib/config/adConfig'

interface adSlotProps {
  adSlot: string
}

const AdSlot = ({ adSlot }: adSlotProps) => {
  // NOTE: to utilise isFirstRender instead of isTransitioning to prevent ads from refreshing if needed
  const isTransitioning = useTransitionState()

  const ad = ads[adSlot]

  if (process.env.ENV === 'development') {
  // if (process.env.ENV === 'production') {
    
    useAdSlot({
      mapping: ad.mapping ? ad.mapping : null,
      id: ad.id,
      adUnit: ad.adUnit,
      sizes: ad.sizes,
      isTransitioning,
    })
  }

  useEffect(() => {
    // @ts-ignore
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  }, [])
  

  // return <div id={`div-gpt-ad-${ad.id}`} />
  return (
    <ins
      className='adsbygoogle'
      style={{ display: 'block' }}
      data-ad-client='ca-pub-4245733463545444'
      data-ad-slot={ad.id}
      data-ad-format='auto'
      data-full-width-responsive='true'
    />
  )
}

export default AdSlot
// export default memo(AdSlot)
