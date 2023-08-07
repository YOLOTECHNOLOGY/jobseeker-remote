/* eslint-disable valid-jsdoc */
import { configKey, getCookie } from './cookies'

// Warning: the English language's value must be en-US,
const countryCounfig = [
  {
    name: 'Philippines',
    key: 'ph',
    url: 'bossjob.ph',
    defaultLocation: {
      id: 63,
      key: "manila",
      value: "Manila",
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
  {
    name: 'Japan',
    key: 'jp',
    url: 'bossjob.jp',
    defaultLocation: {
      id: 1714,
      is_popular: false,
      key: "chuo_ku",
      region_display_name: "Tokyo To",
      seo_value: "chuo-ku",
      value: "Chuo Ku"
    },
    currency: 'jpy',
    id: 105
  },
  {
    name: 'Indonesia',
    key: 'id',
    url: 'bossjob.id',
    defaultLocation: {
      id: 450,
      is_popular: false,
      key: "jakarta_pusat",
      region_display_name: "Jakarta Pusat",
      seo_value: "jakarta_pusat",
      value: "Jakarta Pusat",
    },
    currency: 'idr',
    id: 96
  },
  {
    name: 'Hongkong',
    key: 'hk',
    url: 'bossjob.hk',
    defaultLocation: {
      id: 2857,
      is_popular: false,
      key: "cheung_chau_area",
      region_display_name: "Cheung Chau Area",
      seo_value: "cheung_chau_area",
      value: "Cheung Chau Area",
    },
    currency: 'hkd',
    id: 92
  },
  {
    name: 'Taiwan',
    key: 'tw',
    url: 'bossjob.tw',
    defaultLocation: {
      id: 2487,
      is_popular: false,
      key: "zhongzheng_district",
      region_display_name: "Zhongzheng District",
      seo_value: "zhongzheng_district",
      value: "Zhongzheng District",
    },
    currency: 'ntd',
    id: 211
  },
  {
    name: 'Macau',
    key: 'mo',
    url: 'bossjob.mo',
    defaultLocation: {
      id: 2486,
      is_popular: false,
      key: "macau",
      region_display_name: "Macau",
      seo_value: "macau",
      value: "Macau",
    },
    currency: 'mop',
    id: 123
  }
]

export const languages = [
  { value: 'en-US', id: 1, label: 'English' },
  { value: 'zh-CN', id: 2, label: '中文 (简体)' },
  { value: 'id-ID', id: 3, label: 'Indonesia' },
  { value: 'ja-JP', id: 4, label: '日本語' },
  { value: 'zh-TW', id: 5, label: '中文(繁體)' }
]
export const serverContryCodeMap = {
  'en-US': 'en',
  'zh-CN': 'zh-CN',
  'id-ID': 'id',
  'ja-JP': 'ja',
  'zh-TW': 'zh-TW'
}

export const getLanguageCode = langKey => serverContryCodeMap[langKey] ?? langKey

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

const defaultNation = nations[0];

export const defaultCountryKey = () => defaultNation.value
export const defaultCountryId = () => defaultNation.id
export const defaultCountry = () => defaultNation.label
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
  const country = countryCounfig.find(item => path?.includes?.(item.url))
  if (country) {
    return country.key
  } else {
    return defaultCountryKey()
  }
  // return (process.env.COUNTRY_KEY) || (process.env.HOST_PATH).split('.').pop()
}

/**
 * get countryId by URL and supported countries
 * @returns 
 */
export const getCountryId = () => {
  const countryKey = getCountryKey()
  return countryCounfig.find(item => item.key === countryKey)?.id ?? defaultCountryId()
}

/**
 * get language code by URL or geoConfiguration in cookies
 * @returns 
 */
export const getLang = () => {
  let path =
    typeof window === 'undefined' ? process.env.NEXT_PUBLIC_HOST_PATH : window.location.href
  path = path?.split?.('//')[1]?.split?.('/')?.[1] // https://dev.bossjob.sg/en-US/...
  return languages.map(item => item.value).includes(path) ? path : getCookie(configKey)?.split('_')?.[1] || defaultLanguage()
}

/**
 * get language's full name from url or geoConfiguration in cookies
 * @returns 
 */
export const getLanguage = () => {
  const langCode = getLang()
  const currentLang = languages.find((item) => item.value === langCode)

  return currentLang?.label || defaultLanguageFullName()
}

/**
 * get language's id from url or geoConfiguration in cookies
 * @returns 
 */
export const getLanguageId = () => {
  const langCode = getLang()
  const currentLang = languages.find((item) => item.value === langCode)

  return currentLang?.id || defaultLanguageId()
}
/**
 * get country's full name from url, e.g. ph => Philippines
 * @returns 
 */
export const getCountry = () => {
  const countryKey = getCountryKey();
  const country = nations.find(v => v.value === countryKey)

  return country?.label || defaultCountry()
}

export const countryForCurrency = key => {

  return countryCounfig.find(item => item.key === key)?.currency ?? defaultCurrency()
}


export const countryForPhoneCode = {
  ph: '+63',
  sg: '+65',
  jp: '+81',
  id: '+62'
}