// Convert configs into options for drop down list
// Return [{ key: ?, label: ?, value: ? }]

const getDegreeOptions = (config) => {
    if (!config) return []

    const degreeOptions = config?.degrees
    if (degreeOptions && degreeOptions.length === 0) return degreeOptions
  
    return degreeOptions.map((degree) => {
      return {
        key: degree.key,
        label: degree.value,
        value: degree.key,
      }
    })
  }

  const getCountryOptions = (config) => {
    if (!config) return []

    const countryOptions = config?.country_lists
    if (countryOptions && countryOptions.length === 0) return countryOptions
  
    return countryOptions?.map((country) => {
      return {
        key: country.key,
        label: country.value,
        value: country.key,
      }
    })
  }

export {
  getDegreeOptions, getCountryOptions,
}