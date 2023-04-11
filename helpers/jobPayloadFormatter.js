import { thousandsToNumber, unslugify } from 'helpers/formatter'

/* Helpers */
import { checkFilterMatch as checkFilterMatchV2, userFilterSelectionDataParser as userFilterSelectionDataParserV2 } from './queryEncoder'
/* Vendors */
import moment from 'moment'

const handleSalary = (salaryRanges) => {
  let salaryFrom = ''
  let salaryTo = ''
  if (salaryRanges) {
    salaryFrom = salaryRanges
      .filter((salary) => salary !== 'Below 30K' && salary !== 'Above 200K')
      .map((salaryFrom) => thousandsToNumber('' + salaryFrom.split(' - ')[0]))

    salaryTo = salaryRanges
      .filter((salary) => salary !== 'Below 30K' && salary !== 'Above 200K')
      .map((salaryTo) => thousandsToNumber('' + salaryTo.split(' - ')[1]))

    if (salaryRanges.includes('Below 30K')) {
      salaryFrom.push(0)
      salaryTo.push(30000)
    }
    if (salaryRanges.includes('Above 200K')) {
      salaryFrom.push(200001)
      salaryTo.push(400000)
    }
    salaryFrom = salaryFrom.join(',')
    salaryTo = salaryTo.join(',')
  }
  return [salaryFrom, salaryTo]
}

const formatLocationConfig = (locationList) => {
  const locationConfig = locationList.map((region) => {
    return {
      label: region.display_name,
      value: region.value,
      subList: region.locations
    }
  })
  return locationConfig
}

const urlQueryParser = (string) => {
  // Uncommenting : positive and negative regex lookbehinds not supported in mobile browsers
  // const regex = /(.+?(?=(-jobs|-jobs-in))|(?<=(-jobs-in-)).+)/g

  const doubleQueryPattern = /((\B|\b)-jobs-in-\b)/g
  const singleQueryPattern = /((\B|\b)-jobs\b)/g

  let array = []
  if (string) {
    const hasDoubleQueryPattern = string.match(doubleQueryPattern)
    const hasSingleQueryPattern = string.match(singleQueryPattern)

    if (hasDoubleQueryPattern) {
      array = string?.split?.('-jobs-in-')
    } else if (hasSingleQueryPattern) {
      array = string?.split?.('-jobs')
      array = array.slice(0, -1)
    }
  }

  return array
}

const capitalizeFirstAlphabet = (string) => {
  return (
    (string &&
      string
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')) ||
    ''
  )
  // return (string && string[0].toUpperCase() + string.slice(1)) || ''
}

const SEOJobSearchMetaBuilder = (query, location, category, path) => {
  let title = ''
  let description = ''
  const canonical = path ? path : ''
  const today = new Date()
  let month = today.getMonth() + 1 // January is 0
  month = moment(today).format('MMMM')
  const year = today.getFullYear()

  if (query && !location && !category) {
    title = `${query} Jobs in Philippines, Job Opportunities - ${month} ${year} | Bossjob`
    description = `New ${query} Jobs in Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
  } else if (!query && location && !category) {
    title = `Jobs in ${location}, Philippines, Job Opportunities -  ${month} ${year} | Bossjob`
    description = `New Jobs in ${location}, Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
  } else if (!query && !location && category) {
    title = `${category} Jobs in Philippines, Job Opportunities - ${month} ${year} | Bossjob`
    description = `New ${category} Jobs in Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
  } else if (query && location) {
    title = `${query} Jobs in ${location}, Philippines, Job Opportunities - ${month} ${year} | Bossjob`
    description = `New ${query} Jobs in ${location}, Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
  } else if (location && category) {
    title = `${category} Jobs in ${location}, Philippines, Job Opportunities - ${month} ${year} | Bossjob`
    description = `New ${category} Jobs in ${location}, Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
  } else {
    title = 'Job Hiring, Job Search & Job Openings in Philippines | Bossjob.ph'
    description =
      'Latest job hiring in Philippines. Search job openings & career opportunities with more than 3000 employers on Bossjob!'
  }

  const data = {
    title: title,
    description: description,
    canonical: canonical
  }

  return data
}

const checkFilterMatch = (routerQuery, config, isMobile = false) => {
  const matchedFilterV2 = checkFilterMatchV2(routerQuery, config, isMobile)
  // console.log({matchedFilterV2})
  return matchedFilterV2
}

const userFilterSelectionDataParser = (field, optionValue, routerQuery, config, isClear = false) => {
  const dataV2 = userFilterSelectionDataParserV2(field, optionValue, routerQuery, config, isClear)
  // console.log("dataV2", dataV2)
  return dataV2
}

const getPredefinedParamsFromUrl = (routerQuery, catList, locList, clearAllFilters) => {
  const { keyword } = routerQuery
  let predefinedQuery = null
  let predefinedLocation = null
  let predefinedCategory = null
  let matchedLocation = null
  let matchedCategory = null
  const queryParser = urlQueryParser(keyword)
  if (queryParser) {
    if (queryParser.length > 0) {
      queryParser.forEach((value, index) => {
        matchedLocation = locList.filter((loc) => {
          return loc?.value?.toLowerCase?.() === unslugify(value)
        })
        matchedCategory = catList.filter((cat) => {
          return cat.key === value
        })
        // if queryParser length is 1, and the value can't be matched to location or category, it will be a search query
        if (queryParser.length === 1 && index === 0) {
          if (matchedLocation && matchedLocation.length > 0 && !clearAllFilters) {
            predefinedLocation = [capitalizeFirstAlphabet(unslugify(value))]
            // predefinedLocation = [value]
          } else if (matchedCategory && matchedCategory.length > 0 && !clearAllFilters) {
            predefinedCategory = [value]
          } else if (
            (!matchedLocation && !matchedCategory) ||
            (matchedLocation.length === 0 && matchedCategory.length === 0)
          ) {
            // updateSearchQuery([unslugify(value)])
            predefinedQuery = [unslugify(value)]
          }
        } else if (queryParser.length === 2 && index === 0) {
          if (matchedCategory && matchedCategory.length > 0 && !clearAllFilters) {
            predefinedCategory = [value]
          } else if (!matchedCategory || matchedCategory.length === 0) {
            predefinedQuery = [unslugify(value)]
          }
        } else if (queryParser.length === 2 && index === 1) {
          if (matchedLocation && matchedLocation.length > 0 && !clearAllFilters) {
            predefinedLocation = [capitalizeFirstAlphabet(unslugify(value))]
          }
        }
      })
    }
  }
  return {
    predefinedQuery,
    predefinedCategory,
    predefinedLocation
  }
}

const getJobTypeList = (config) => {
  return config.job_types.map((jobType) => ({
    ...jobType,
    label: jobType.value,
    value: jobType.key
  }))
}

const getLocationList = (config) => {
  if (!config) return []

  const locList =
    config &&
    config &&
    config.location_lists
      .map((region) =>
        region.locations.map((loc) => ({
          ...loc,
          // loc value all lower case
          value: loc?.value
        }))
      )
      .reduce((a, c) => a.concat(c), [])

  return locList
}

const getSmsCountryList = (config) => {
  if (!config) return []

  const smsCountryList = []
  const countryList = config?.country_lists ?? []
  countryList.forEach((country) => {
    if (country.is_sms_allowed) {
      const smsCountry = {
        value: country['code'],
        label: country['code'] + ' (' + country['value'] + ')'
      }

      smsCountryList.push(smsCountry)
    }
  })

  return smsCountryList
}

const getJobCategoryList = (config) => {
  if (!config) return []

  const categories = []

  config?.job_category_lists.forEach((mainCategory) => {
    mainCategory.sub_list.forEach((subList) => {
      subList['label'] = subList['value']
      categories.push(subList)
    })
  })

  return categories
}

const getJobCategoryIds = (config, categories) => {
  if (!config) return []

  const categoryLists = config?.job_category_lists
  const categoryIds = []

  categoryLists.forEach((mainCategory) => {
    mainCategory.sub_list.forEach((subList) => {
      if (categories.includes(subList.value)) {
        categoryIds.push(subList.id)
      }
    })
  })

  return categoryIds
}

const getNoticePeriodList = (config) => {
  return config?.notice_period_lists.map((notice) => ({
    ...notice,
    label: notice.value,
    value: notice.id
  }))
}

const getSalaryOptions = (config, salaryFrom, hasComparedTo) => {
  if (!config) return null
  const salaryConfig = config?.salary_ranges
  if (salaryConfig && salaryConfig.length === 0) return salaryConfig

  const _salaryTo = hasComparedTo ? salaryFrom * salaryConfig.upper_bound_scale : salaryConfig.to
  const _salaryFrom = salaryFrom ? salaryFrom + salaryConfig.interval : salaryConfig.from

  const salaryOptions = []
  for (let salary = _salaryFrom; salary <= _salaryTo; salary += salaryConfig.interval)
    salaryOptions.push({ label: salary, value: salary })
  return salaryOptions
}

const getCountryList = (config) => {
  if (!config) return []

  const countryLists = config?.country_lists ?? []
  if (countryLists && countryLists.length === 0) return countryLists

  let countryOptions = countryLists.map((country) => {
    return {
      label: country.value,
      value: country.value,
      key: country.key
    }
  })

  countryOptions = countryOptions.filter((country) => country.key !== 'ph')

  return countryOptions
}

const getIndustryList = (config) => {
  if (!config) return []

  const industryList = config?.industry_lists
  if (industryList && industryList.length === 0) return industryList

  return industryList.map((industry) => {
    return {
      label: industry.value,
      value: industry.value,
      key: industry.key
    }
  })
}

const getDegreeList = (config) => {
  if (!config) return []

  const degreeList = config?.degrees
  if (degreeList && degreeList.length === 0) return degreeList

  return degreeList.map((degree) => {
    return {
      label: degree.value,
      value: degree.key,
      key: degree.key
    }
  })
}

const getApplyJobLink = (job, user) => {
  // jobUrl => /job/xxxx
  // Apply job url format: /apply-job/xxx
  const applyJobUrl = `${process.env.HOST_PATH}${job?.job_url}/apply`

  if (user) {
    if (!user?.is_profile_completed) {
      return `${process.env.HOST_PATH}/jobseeker-complete-profile/1?redirect=${applyJobUrl}`
    }

    if (job?.external_apply_url) {
      let externalApplyUrl = job?.external_apply_url

      if (
        externalApplyUrl !== '' &&
        externalApplyUrl !== null &&
        !/^(f|ht)tps?:\/\//i.test(externalApplyUrl)
      ) {
        externalApplyUrl = 'https://' + externalApplyUrl
      }

      return externalApplyUrl
    }

    return applyJobUrl
  }

  return `${process.env.HOST_PATH}/get-started?redirect=${applyJobUrl}`
}

// TODO: remove isLocation param after backend as renamed the field
const mapSeoValueToGetValue = (value, configArray, hasSubList, isLocation) => {
  const valueToReturn = []
  // if config hasSubList e.g: category
  if (hasSubList) {
    value?.forEach?.((v) => {
      configArray.forEach((option) => {
        if (option['seo-value'] === v) {
          valueToReturn.push(option.value)
        } else {
          option.sub_list.forEach((subOption) => {
            if (subOption['seo-value'] === v) {
              valueToReturn.push(subOption.value)
            }
          })
        }
      })
    })
  } else {
    if (isLocation) {
      value?.forEach?.((v) => {
        configArray.forEach((option) => {
          if (option['seo_value'] === v) {
            valueToReturn.push(option.value)
          }
        })
      })
    } else {
      value?.forEach?.((v) => {
        configArray.forEach((option) => {
          if (option['seo-value'] === v) {
            valueToReturn.push(option.value)
          }
        })
      })
    }
  }
  return valueToReturn.join()
}

export {
  handleSalary,
  urlQueryParser,
  capitalizeFirstAlphabet,
  SEOJobSearchMetaBuilder,
  getPredefinedParamsFromUrl,
  formatLocationConfig,
  getJobTypeList,
  getLocationList,
  getNoticePeriodList,
  getSmsCountryList,
  getJobCategoryList,
  getJobCategoryIds,
  getSalaryOptions,
  getCountryList,
  getIndustryList,
  getDegreeList,
  getApplyJobLink,
  userFilterSelectionDataParser,
  checkFilterMatch,
  mapSeoValueToGetValue
}
