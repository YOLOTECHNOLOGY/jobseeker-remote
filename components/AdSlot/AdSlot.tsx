import React, { memo } from 'react'

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
    useAdSlot({
      mapping: ad.mapping ? ad.mapping : null,
      id: ad.id,
      adUnit: ad.adUnit,
      sizes: ad.sizes,
      isTransitioning,
    })
  }

  return <div id={`div-gpt-ad-${ad.id}`} />
}

export default memo(AdSlot)
