import { useEffect, useState } from "react"

const useUserAgent = () => {
  const [isMobile, setMobile] = useState(false)
  const [userAgent, setUserAgent] = useState(null)

  useEffect(() => {
    const ua = typeof navigator === "undefined" ? "" : navigator.userAgent
    const mobile = Boolean(ua.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i))
    setMobile(mobile)
    setUserAgent(ua)
  }, [])

  return { isMobile, userAgent }
}

export default useUserAgent