import React from 'react'
import Script from 'next/script'
import useAdSlot from 'helpers/useAdSlot'
import useTransitionState from 'helpers/useTransitionState'
import ads from 'lib/config/adConfig'

interface adSlotProps {
  adSlot: string
}

const AdSlot = ({ adSlot }: adSlotProps) => {
  {/* Google Adsense and Ad Manager scripts */}
  <React.Fragment>
    <Script
      strategy="beforeInteractive"
      src='https://securepubads.g.doubleclick.net/tag/js/gpt.js'
    />
    <Script
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
          __html: `
        window.googletag = window.googletag || {cmd: []}
      `,
        }}
    />
    <Script
      data-ad-client='ca-pub-4245733463545444'
      strategy="beforeInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
    />
  </React.Fragment>

  const isTransitioning = useTransitionState()

  const ad = ads[adSlot]

  // if (process.env.ENV === 'development') {
  if (process.env.ENV === 'development') { 
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
