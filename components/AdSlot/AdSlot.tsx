import React from 'react'
import useAdSlot from 'helpers/useAdSlot'
import useTransitionState from 'helpers/useTransitionState'
import ads from 'lib/config/adConfig'

interface adSlotProps {
  adSlot: string
}

const AdSlot = ({ adSlot }: adSlotProps) => {
  const isTransitioning = useTransitionState()

  const ad = ads[adSlot]

  if (process.env.ENV === 'development') {
  // if (process.env.ENV === 'production') {
    
    useAdSlot({
      mapping: ad.mapping ? ad.mapping : {},
      id: ad.id,
      adUnit: ad.adUnit,
      sizes: ad.sizes,
      isTransitioning,
    })
  }

  return <div id={`div-gpt-ad-${ad.id}`} />
}

export default AdSlot
// export default memo(AdSlot)
