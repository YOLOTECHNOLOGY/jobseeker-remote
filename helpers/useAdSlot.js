import { useEffect } from 'react'

function useAdSlot({ mapping, sizes, id, adUnit, isTransitioning }) {
  useEffect(() => {
    try {
      if (!isTransitioning && typeof window !== undefined) {
        const { googletag } = window
        if (googletag?.apiReady) {
          googletag.cmd.push(function () {
            const adMapping = googletag.sizeMapping()
            Object.keys(mapping).forEach((breakpoint) => {
              const isSingleSizePerMapping = mapping[breakpoint].length < 1
              adMapping.addSize(
                [Number(breakpoint), 0],
                isSingleSizePerMapping ? mapping[breakpoint] : [mapping[breakpoint]]
              )
            })
            const builtMapping = adMapping.build()

            googletag
              ?.defineSlot(`/21858999436/${adUnit}`, sizes, `div-gpt-ad-${id}`)
              ?.defineSizeMapping?.(builtMapping)
              ?.addService(googletag.pubads())

            googletag.enableServices()
          })
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
