export const nations = [
  { value: 'ph', label: 'Philippines' },
  { value: 'sg', label: 'Singapore' }
]

export const languages = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-CN', label: '中文 (简体)' }
]

export const getCountryKey = () => {
  const path =
    typeof window === 'undefined' ? process.env.NEXT_PUBLIC_HOST_PATH : window.location.href
  if (path?.includes?.('.sg')) {
    return 'sg'
  } else {
    return 'ph'
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
  path = path.split('//')[1].split('/')[1]; // https://dev.bossjob.sg/en-US/...
  return path || 'en-US'
}

export const getLanguage = () => {
  const langCode = getLang();
  const currentLang = languages.find(item => item.value === langCode);

  return currentLang?.label || 'English'
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

export const countryForCurrency = {
  ph: 'php',
  sg: "sgd"
}