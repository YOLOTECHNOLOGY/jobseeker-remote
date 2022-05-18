import { useEffect } from 'react'

function useAdSlot({ mapping, sizes, id, adUnit, isTransitioning }) {
  useEffect(() => {
    try {
      if (!isTransitioning && typeof window !== undefined) {
        const { googletag } = window
        if (googletag.apiReady) {
          googletag.cmd.push(function () {
            // debugger
            const adMapping = googletag.sizeMapping()
            Object.keys(mapping).forEach((breakpoint) => {
              // debugger
              adMapping.addSize([Number(breakpoint), 0], [mapping[breakpoint]])
            })
            const builtMapping = adMapping.build()

            console.log('useAdSlot 2', adUnit, id, sizes)

            googletag
            .defineSlot(`/21858999436/${adUnit}`, sizes, `div-gpt-ad-${id}`)
            .defineSizeMapping(builtMapping)
            .addService(googletag.pubads())
            
            googletag.enableServices()
          })
          // console.log('useAdSlot ad id', id)
          googletag.pubads().collapseEmptyDivs()

          googletag.cmd.push(function () {
            googletag.display(`div-gpt-ad-${id}`)
          })
        }
      }
    } catch (err) {
      console.error(err)
    }
  }, [mapping, sizes, adUnit, id, isTransitioning])
}

export default useAdSlot
