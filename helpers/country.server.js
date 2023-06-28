import { cookies } from 'next/headers'

export const getServerLang = () => {
  let path =
    typeof window === 'undefined' ? process.env.NEXT_PUBLIC_HOST_PATH : window.location.href
  path = path?.split?.('//')[1]?.split?.('/')?.[1] // https://dev.bossjob.sg/en-US/...
  const geoConfiguration = cookies().get('geoConfiguration')?.value || ''
  return path || geoConfiguration.split('_')?.[1] || 'en-US'
}
