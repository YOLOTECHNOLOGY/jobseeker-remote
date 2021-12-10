import { useEffect } from 'react'

function useAdSlot({ mapping, sizes, id, adUnit, isTransitioning }) {
  useEffect(() => {
    if (!isTransitioning && typeof window !== undefined) {
      const { googletag } = window
      googletag.cmd.push(function () {
        const adMapping = googletag.sizeMapping()
        Object.keys(mapping).forEach((breakpoint) => {
          adMapping.addSize([Number(breakpoint), 0], [mapping[breakpoint]])
        })
        const builtMapping = adMapping.build()

        googletag
          .defineSlot(`/21858999436/${adUnit}`, sizes, `div-gpt-ad-${id}`)
          .defineSizeMapping(builtMapping)
          .addService(googletag.pubads())
        googletag.enableServices()
      })

      googletag.pubads().collapseEmptyDivs()
      googletag.enableServices()

      googletag.cmd.push(function () {
        googletag.display(`div-gpt-ad-${id}`)
      })
    }
  }, [mapping, sizes, adUnit, id, isTransitioning])
}


export default useAdSlot