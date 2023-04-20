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

export const  countryForCurrency = {
  ph: 'php',
  sg: "sgd"
}