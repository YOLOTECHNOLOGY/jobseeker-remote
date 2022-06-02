import React, { useEffect } from 'react'
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
    // useAdSlot({
    //   mapping: ad.mapping ? ad.mapping : {},
    //   id: ad.id,
    //   adUnit: ad.adUnit,
    //   sizes: ad.sizes,
    //   isTransitioning,
    // })
    useEffect(() => {
      console.log("isTransitioning: ", isTransitioning)
      try {
        if (!isTransitioning && typeof window !== undefined) {
          window.googletag = window.googletag || {}
          const { googletag } = window
          googletag.cmd = googletag.cmd || [];
          if (window.googletag && googletag.apiReady) {
            googletag.cmd.push(function () {
              // debugger
              const adMapping = googletag.sizeMapping()
              Object.keys(ad.mapping).forEach((breakpoint) => {
                // debugger
                const isSingleSizePerMapping = ad.mapping[breakpoint].length < 1
                console.log(
                  'addSize',
                  [Number(breakpoint), 0],
                  isSingleSizePerMapping ? ad.mapping[breakpoint] : [ad.mapping[breakpoint]]
                )
                adMapping.addSize([Number(breakpoint), 0], isSingleSizePerMapping ? ad.mapping[breakpoint] : [ad.mapping[breakpoint]])
              })
              const builtMapping = adMapping.build()

              console.log('adMapping', adMapping)
              console.log('builtMapping', builtMapping)

              googletag
              .defineSlot(`/21858999436/${ad.adUnit}`, ad.sizes, `div-gpt-ad-${ad.id}`)
              .defineSizeMapping(builtMapping)
              .addService(googletag.pubads())
              console.log(`adUnit: ${"/21858999436/"+ad.adUnit}, adsizes: ${ad.sizes}, display: ${"div-gpt-ad-"+ad.id}`)
              googletag.enableServices()
              googletag.pubads().collapseEmptyDivs()

              googletag.cmd.push(function () {
                googletag.display(`div-gpt-ad-${ad.id}`)
              })
            })
          }
        }
      } catch (err) {
        console.error(err)
      }
    }, [ad.mapping, ad.sizes, ad.adUnit, ad.id, isTransitioning])
  }

  return <div id={`div-gpt-ad-${ad.id}`} />
}

export default AdSlot
// export default memo(AdSlot)
