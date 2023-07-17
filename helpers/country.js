import { getCookie } from './cookies'

// Warning: the English language's value must be en-US,
const countryCounfig = [
  {
    name: 'Philippines',
    key: 'ph',
    url: 'bossjob.ph',
    defaultLocation: {
      id: 63,
      key: "manila",
      value: "Manila111",
      is_popular: false,
      region_display_name: "National Capital Region",
      seo_value: "manila"
    },
    currency: 'php',
    id: 167
  },
  {
    name: 'Singapore',
    key: 'sg',
    url: 'bossjob.sg',
    defaultLocation: {
      id: 165,
      is_popular: false,
      key: "downtown_core",
      region_display_name: "Central",
      seo_value: "downtown-core",
      value: "Downtown Core",
    },
    currency: 'sgd',
    id: 193
  },
]

export const languages = [
  { value: 'en-US', id: 1, label: 'English' },
  { value: 'zh-CN', id: 2, label: '中文 (简体)' }
]

export const nations = countryCounfig.map(item => {
  return {
    value: item.key,
    label: item.name,
    id: item.id
  }
})
export const getDefaultLocation = key => {

  return countryCounfig.find(item => item.key === key)?.defaultLocation
}

export const defaultCountryKey = () => nations[0].value
export const defaultCountryId = () => nations[0].id
export const defaultCountry = () => nations[0].label
export const defaultCurrency = () => countryCounfig[0].currency

export const defaultLanguage = () => languages[0].value
export const defaultLanguageFullName = () => languages[0].label
export const defaultLanguageId = () => languages[0].id


/**
 * TODO: the geoConfiguration's value is not always sames as URL
 */


// /**
//  * get Country key from Url
//  * @return  country
//  */
// export const getCountryKey = () => {
//   const path =
//     typeof window === 'undefined' ?
//       process.env.NEXT_PUBLIC_HOST_PATH :
//       window.location.hostname
//   // path maybe is  localhost
//   // don't use 127.0.0.1 as dev public path
//   const countryKey = path?.includes('.') && path?.split?.('.')?.pop()

//   return countryKey || defaultCountryKey()
// }



export const getCountryKey = () => {
  const path =
    typeof window === 'undefined' ? process.env.NEXT_PUBLIC_HOST_PATH : window.location.href
  const country = countryCounfig.find(item => path.includes(item.url))
  if (country) {
    return country.key
  } else {
    return defaultCountryKey()
  }
  // return (process.env.COUNTRY_KEY) || (process.env.HOST_PATH).split('.').pop()
}

export const getCountryId = () => {
  const countryKey = getCountryKey()

  return { sg: 193, ph: 167 }[countryKey]
}

export const getLang = () => {
  let path =
    typeof window === 'undefined' ? process.env.NEXT_PUBLIC_HOST_PATH : window.location.href
  path = path?.split?.('//')[1]?.split?.('/')?.[1] // https://dev.bossjob.sg/en-US/...
  return languages.map(item => item.value).includes(path) ? path : getCookie(configKey)?.split('_')?.[1] || defaultLanguage()
}

export const getLanguage = () => {
  const langCode = getLang()
  const currentLang = languages.find((item) => item.value === langCode)

  return currentLang?.label || 'English'
}

export const getLanguageId = () => {
  const langCode = getLang()
  const currentLang = languages.find((item) => item.value === langCode)
  return currentLang?.id || 1
}

export const getCountry = () => {
  const path =
    typeof window === 'undefined' ? process.env.NEXT_PUBLIC_HOST_PATH : window.location.href
  if (path?.includes?.('.sg')) {
    return 'Singapore'
  } else {
    return 'Philippines'
  }
  // return (process.env.COUNTRY_KEY) || (process.env.HOST_PATH).split('.').pop()
}

export const countryForCurrency = key => {

  return countryCounfig.find(item => item.key === key)?.currency ?? defaultCurrency()
}
