'use client'
import React from 'react'
import Script from 'next/script'
import useAdSlot from 'helpers/useAdSlot'
import useTransitionState from 'app/components/AdSlot/useTransitionState'
import { getCountryKey } from 'helpers/country'
import getAdForCountry from 'lib/config/adConfig'

interface adSlotProps {
  adSlot: string
}

const AdSlot = ({ adSlot }: adSlotProps) => {
  const isTransitioning = useTransitionState()
  const countryKey = getCountryKey()
  const ad = getAdForCountry(countryKey, adSlot)
  useAdSlot({
    mapping: ad.mapping ? ad.mapping : {},
    id: ad.id,
    adUnit: ad.adUnit,
    sizes: ad.sizes,
    isTransitioning
  })


  return (
    <div>
      {/* Google Adsense and Ad Manager scripts */}
      <Script strategy='lazyOnload' src='https://securepubads.g.doubleclick.net/tag/js/gpt.js' />
      <Script
        data-ad-client='ca-pub-4245733463545444'
        strategy='lazyOnload'
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      />
      <div id={`div-gpt-ad-${ad.id}`} />
    </div>
  )
}

export default AdSlot
