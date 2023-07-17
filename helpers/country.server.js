import { cookies } from 'next/headers'
import { defaultLanguage, languages } from './country'

export const getServerLang = () => {
  let path =
    typeof window === 'undefined' ? process.env.NEXT_PUBLIC_HOST_PATH : window.location.href
  path = path?.split?.('//')[1]?.split?.('/')?.[1] // https://dev.bossjob.sg/en-US/...
  const geoConfiguration = cookies().get('geoConfiguration')?.value || ''
  const langValues = languages.map(item => item.value)
  return langValues.includes(path) ? path : geoConfiguration.split('_')?.[1] || defaultLanguage()
}
