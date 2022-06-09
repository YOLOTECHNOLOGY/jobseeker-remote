// import { stringify } from 'query-string'
import { flat, thousandsToNumber, unslugify } from 'helpers/formatter'

/* Helpers */
import { authPathToOldProject } from 'helpers/authenticationTransition'

/* Vendors */
import moment from 'moment'
import slugify from 'slugify'

const handleSalary = (salaryRanges) => {
  let salaryFrom = ''
  let salaryTo = ''
  if (salaryRanges) {
    const sanitiseSalaryRange = salaryRanges.map((range) =>
      range === 'Below 30K' ? '10K - 30K' : range
    )

    salaryFrom = sanitiseSalaryRange
      .filter((salary) => salary !== 'Above_200K')
      .map((salaryFrom) => thousandsToNumber('' + salaryFrom.split(' - ')[0]))

    salaryTo = sanitiseSalaryRange
      .filter((salary) => salary !== 'Above_200K')
      .map((salaryTo) => thousandsToNumber('' + salaryTo.split(' - ')[1]))

    if (sanitiseSalaryRange.includes('Above_200K')) {
      salaryFrom.push('200001')
      salaryTo.push('400000')
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
      subList: region.locations,
    }
  })
  return locationConfig
}

const urlQueryParser = (string) => {
  // Uncommenting : positive and negative regex lookbehinds not supported in mobile browsers
  // const regex = /(.+?(?=(-jobs|-jobs-in))|(?<=(-jobs-in-)).+)/g

  const doubleQueryPattern = /(\b-jobs-in-\b)/g
  const singleQueryPattern = /(\b-jobs\b)/g

  let array = []
  if (string) {
    const hasDoubleQueryPattern = string.match(doubleQueryPattern)
    const hasSingleQueryPattern = string.match(singleQueryPattern)

    if (hasDoubleQueryPattern) {
      array = string.split('-jobs-in-')
    } else if (hasSingleQueryPattern) {
      array = string.split('-jobs')
      array = array.slice(0, -1)
    }
  }

  return array
}

const categoryParser = (category) => {
  const regex = /[^A-Za-z0-9]+/g
  let value = category.replace(regex, '-')

  // check if last character is '-', if yes remove
  const lastDash = value.match(/(-?\s*)$/g)
  if (lastDash.length > 1) {
    const lastIndex = value.lastIndexOf('-')
    value = value.substr(0, lastIndex)
  }
  return value.toLowerCase().replace('-26', '')
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

// const capitalizeFirstAlphabet = string =>
//   (string && string[0].toUpperCase() + string.slice(1)) || ''

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
    canonical: canonical,
  }

  return data
}

const nonFilterKeys = [
  'keyword',
  'search',
  'page',
  'id',
  'sort',
  'utm_source',
  'utm_campaign',
  'utm_medium',
]

const buildQueryParams = (data) => {
  let queryString = ''
  queryString = Object.keys(data)
    .map((key) => {
      const string = data[key]
        .map((filter) => {
          if (filter) return filter['seo-value']
        })
        .join()
      return key + '=' + string
    })
    .join('&')
  queryString = '?' + queryString
  return queryString
}

// check if there is a match
const checkFilterMatch = (routerQuery, config, useCase) => {
  const { keyword } = routerQuery
  const queryParser = urlQueryParser(keyword)
  const locationList = config.inputs.location_lists
  const industryList = config.inputs.industry_lists
  const expLvlList = config.inputs.xp_lvls
  const eduLevelList = config.filters.educations
  const jobTypeList = config.inputs.job_types
  const categoryList = config.inputs.job_category_lists
  const salaryRangeList = config.filters.salary_range_filters.map((range) => ({
    key: range.key === '10K - 30K' ? 'Below 30K' : range.key,
    value: range.value === '10K - 30K' ? 'Below 30K' : range.value,
    ['seo-value']: range['seo-value'],
  }))
  const formatLocationConfig = (locationList) => {
    const locationConfig = locationList?.map((region) => region.locations)
    return locationConfig
  }
  const formattedLocationList = flat(formatLocationConfig(locationList))
  const sanitisedConfig = {
    industry: industryList,
    jobType: jobTypeList,
    salary: salaryRangeList,
    workExperience: expLvlList,
    qualification: eduLevelList,
    location: formattedLocationList,
    category: categoryList,
  }
  let predefinedQuery = ''
  let matchedFilter = {
    searchMatch: false,
    locationMatch: false,
    // searchQuery: queryParser && queryParser.length > 0 ? queryParser[0] : '',
  }
  Object.keys(sanitisedConfig).forEach((key) => {
    // iterate based on number of results from queryParser
    queryParser.forEach((parsedData, index) => {
      if (key === 'category') {
        sanitisedConfig[key].forEach((data) => {
          if (data['seo-value'] === parsedData) {
            predefinedQuery = parsedData
            matchedFilter = {
              ...matchedFilter,
              searchMatch: true,
            }
          }
        })
        sanitisedConfig[key].forEach((data) => {
          data.sub_list.forEach((subOption) => {
            if (subOption['seo-value'] === parsedData) {
              predefinedQuery = parsedData
              matchedFilter = {
                ...matchedFilter,
                searchMatch: true,
              }
            }
          })
        })
      } else {
        sanitisedConfig[key].filter((data) => {
          if (key === 'location' && index == 1) {
            if (data['seo_value'] === parsedData) {
              matchedFilter = {
                ...matchedFilter,
                locationMatch: true,
              }
            }
          } else if (key === 'location' && index === 0) {
            if (data['seo_value'] === parsedData) {
              matchedFilter = {
                ...matchedFilter,
                locationMatch: true,
              }
            }
          } else {
            if (data['seo-value'] === parsedData) {
              matchedFilter = {
                ...matchedFilter,
                searchMatch: true,
              }
            }
          }
        })
      }
    })
  })

  if (queryParser.length > 0 && queryParser[0] !== predefinedQuery) {
    const searchQuery = queryParser[0]
    matchedFilter = {
      ...matchedFilter,
      searchQuery:searchQuery
    }
  }
  // if (!matchedFilter.searchMatch && !matchedFilter.locationMatch){
  //   matchedFilter = {
  //     ...matchedFilter,
  //     searchQuery: queryParser && queryParser.length > 0 ? queryParser[0] : '',
  //   }
  // }else if (!matchedFilter.searchMatch && matchedFilter.locationMatch) {
  //   matchedFilter = {
  //     ...matchedFilter,
  //     searchQuery: queryParser,
  //   }
  // }
  return matchedFilter
}

// handle MUI filters not under "More Filters"
const userFilterSelectionDataParser = (field, optionValue, routerQuery, config, isClear) => {
  const { keyword, ...rest } = routerQuery
  const queryParser = urlQueryParser(keyword)
  const locationList = config.inputs.location_lists
  const industryList = config.inputs.industry_lists
  const expLvlList = config.inputs.xp_lvls
  const eduLevelList = config.filters.educations
  const jobTypeList = config.inputs.job_types
  const categoryList = config.inputs.job_category_lists
  const salaryRangeList = config.filters.salary_range_filters.map((range) => ({
    key: range.key === '10K - 30K' ? 'Below 30K' : range.key,
    value: range.value === '10K - 30K' ? 'Below 30K' : range.value,
    ['seo-value']: range['seo-value'],
  }))
  const formatLocationConfig = (locationList) => {
    const locationConfig = locationList?.map((region) => region.locations)
    return locationConfig
  }
  const formattedLocationList = flat(formatLocationConfig(locationList))
  const sanitisedConfig = {
    industry: industryList,
    jobType: jobTypeList,
    salary: salaryRangeList,
    workExperience: expLvlList,
    qualification: eduLevelList,
    location: formattedLocationList,
    category: categoryList,
  }

  let matchedConfigFromUrl = {}
  let matchedConfigFromUserSelection = {}
  let matchedLocation = {}
  let predefinedQuery = ''
  let searchQuery = ''
  let predefinedLocation = ''
  let filterData = {}

  // handle predefined filters from url (keyword)
  Object.keys(sanitisedConfig).forEach((key) => {
    // iterate based on number of results from queryParser
    queryParser.forEach((parsedData, index) => {
      if (key === 'category') {
        const mainOptionMatched = []
        const subOptionMatched = []

        sanitisedConfig[key].forEach((data) => {
          if (data['seo-value'] === parsedData) {
            predefinedQuery = parsedData
            mainOptionMatched.push(data)
            // return data['seo-value'] === parsedData
          }
        })
        sanitisedConfig[key].map((data) => {
          data.sub_list.forEach((subOption) => {
            if (subOption['seo-value'] === parsedData) {
              predefinedQuery = parsedData
              subOptionMatched.push(subOption)
            }
          })
        })

        if (mainOptionMatched.length > 0) {
          matchedConfigFromUrl = {
            ...matchedConfigFromUrl,
            [key]: mainOptionMatched,
          }
        }
        if (subOptionMatched.length > 0) {
          matchedConfigFromUrl = {
            ...matchedConfigFromUrl,
            [key]: subOptionMatched,
          }
        }
      } else {
        const hasMatch = sanitisedConfig[key].filter((data) => {
          if (key === 'location' && index == 1) {
            if (data['seo_value'] === parsedData) {
              predefinedLocation = parsedData
              return data['seo_value'] === parsedData
            }
          } else if (key === 'location' && index === 0) {
            if (data['seo_value'] === parsedData) {
              predefinedLocation = parsedData
              return data['seo_value'] === parsedData
            }
          } else {
            if (data['seo-value'] === parsedData) {
              predefinedQuery = parsedData
              return data['seo-value'] === parsedData
            }
          }
        })
        if (hasMatch.length > 0 && key !== 'location') {
          matchedConfigFromUrl = {
            ...matchedConfigFromUrl,
            [key]: hasMatch,
          }
        } else if (hasMatch.length > 0 && key === 'location') {
          matchedLocation = {
            [key]: hasMatch,
          }
        }
      }
    })
  })

  // if parsedData[0] is not predefined query, it is a search term
  if (queryParser.length > 0 && queryParser[0] !== predefinedQuery) searchQuery = queryParser[0]

  // handle filters from user selection
  let updatedFilters = { ...rest }
  // if optionValue !== [], include current filter with the rest of the filters
  if (field === 'location' && optionValue && optionValue.length !== 0) {
    updatedFilters = { ...rest, [field]: optionValue.seo_value }
  } else if (field === 'category') {
    updatedFilters = { ...rest, [field]: optionValue.join() }
  } else {
    if (optionValue && optionValue.length !== 0) {
      updatedFilters = { ...rest, [field]: optionValue.join(',') }
    } else {
      delete updatedFilters[field]
    }
  }
  // handle the rest of the filters. remove nonfilter keys, and convert strings of value to array of strings
  for (const [key, value] of Object.entries(updatedFilters)) {
    // only proceed if it is not a non filter key
    if (!nonFilterKeys.includes(key)) {
      const arrayVal = value.split(',')
      // only proceed if value is not null && not empty
      if (arrayVal && arrayVal.length !== 0) {
        // handle filters not under 'More filters' section
        filterData = {
          ...filterData,
          // ensure to only push unduplicated results
          [key]: Array.from(new Set(arrayVal)).join(','),
        }
        const hasMatch = []
        let isLocationMatch = false
        arrayVal.forEach((val) => {
          if (key === 'category') {
            const mainOptionMatched = []
            const subOptionMatched = []

            sanitisedConfig[key].forEach((data) => {
              if (data['seo-value'] === val) {
                predefinedQuery = val
                mainOptionMatched.push(data)
                // return data['seo-value'] === parsedData
              }
            })
            sanitisedConfig[key].map((data) => {
              data.sub_list.forEach((subOption) => {
                if (subOption['seo-value'] === val) {
                  predefinedQuery = val
                  subOptionMatched.push(subOption)
                }
              })
            })

            if (mainOptionMatched.length > 0) {
              matchedConfigFromUserSelection = {
                ...matchedConfigFromUserSelection,
                [key]: mainOptionMatched,
              }
            }
            if (subOptionMatched.length > 0) {
              matchedConfigFromUserSelection = {
                ...matchedConfigFromUserSelection,
                [key]: subOptionMatched,
              }
            }
          } else {
            const matchedFilter = sanitisedConfig[key]?.filter((data) => {
              if (key === 'location') {
                if (data['seo_value'] === val) {
                  isLocationMatch = true
                  return data['seo_value'] === val
                }
              } else {
                return data['seo-value'] === val
              }
            })
            if (matchedFilter.length !== 0) hasMatch.push(matchedFilter[0])
          }
        })
        if (hasMatch.length > 0) {
          if (isLocationMatch) {
            matchedLocation = {
              ...matchedLocation,
              [key]: hasMatch,
            }
          } else {
            matchedConfigFromUserSelection = {
              ...matchedConfigFromUserSelection,
              [key]: hasMatch,
            }
          }
        }
      }
    }
  }

  let filterCount = 0
  let filterParamsObject = {}
  let query = ''
  let filterQuery = ''
  let locationQuery = ''
  Object.values(matchedLocation).forEach((val) => {
    val.forEach((data) => {
      locationQuery = data['seo_value']
    })
  })
  Object.values(matchedConfigFromUserSelection).forEach((val) => {
    val.forEach((data) => {
      filterQuery = data['seo-value']
    })
  })

  const array = []
  if (Object.keys(matchedLocation).length > 0) array.push(matchedLocation)
  if (Object.keys(matchedConfigFromUrl).length > 0) array.push(matchedConfigFromUrl)
  if (Object.keys(matchedConfigFromUserSelection).length > 0)
    array.push(matchedConfigFromUserSelection)

  let uniqueList = []
  array.forEach((matchData) => {
    for (const [key] of Object.entries(matchData)) {
      const data =
        key === 'location'
          ? matchData[key].map((filter) => filter['seo_value'])
          : matchData[key].map((filter) => filter['seo-value'])

      uniqueList = [...uniqueList, ...data]
      uniqueList = [...new Set(uniqueList)]

      const match = data.join()

      if (filterParamsObject[key]) {
        filterParamsObject = {
          ...filterParamsObject,
          [key]: !filterParamsObject[key].includes(match)
            ? (filterParamsObject[key] += `,${match}`)
            : filterParamsObject[key],
        }
      } else {
        filterParamsObject = {
          ...filterParamsObject,
          [key]: match,
        }
      }

      // if field is location and isClear is true
      if (field === 'location' && isClear) delete filterParamsObject['location']
    }
  })

  filterCount = uniqueList.length

  if (filterCount === 0) {
    // it means there is no predefinedQuery && predefinedLocation
    query = appendSingleQueryPattern(queryParser[0])
  } else if (filterCount === 1) {
    if (isClear){
      // if field is location && isClear is true
      if (searchQuery && predefinedLocation && field === 'location' && isClear) {
        query = appendSingleQueryPattern(searchQuery)
      }
    }
     // if there is searchQuery && predefinedLocation
     else if (searchQuery && predefinedLocation && !locationQuery) {
      query = appendDoubleQueryPattern(searchQuery, predefinedLocation)
      // if there is searchQuery && locationQuery
    } else if (searchQuery && !predefinedLocation && locationQuery) {
      query = appendDoubleQueryPattern(searchQuery, locationQuery)
      // if there is searchQuery but !predfinedLocation && !locationQuery
    } else if (searchQuery && !predefinedLocation && !locationQuery) {
      query = appendSingleQueryPattern(searchQuery)
      // if there is no predefinedQuery && there is predefinedLocation
    } else if (!predefinedQuery && predefinedLocation) {
      query = appendSingleQueryPattern(predefinedLocation)
      // if there is predefinedQuery && !predefinedLocation
    } else if (predefinedQuery && !predefinedLocation) {
      query = appendSingleQueryPattern(predefinedQuery)
      // if there is no predefinedQuery && there is no predefinedLocation but there is locationMatch
    } else if (!predefinedQuery && !predefinedLocation && locationQuery) {
      query = appendSingleQueryPattern(locationQuery)
      // if there is no predefinedQuery && there is no predefinedLocation
    } else if (!predefinedQuery && !predefinedLocation) {
      query = appendSingleQueryPattern(filterQuery)
    }
  } else if (filterCount === 2) {
    // if there is searchQuery
    if (searchQuery) {
      query = appendSingleQueryPattern(searchQuery)
    } else if (searchQuery && locationQuery) {
      query = appendDoubleQueryPattern(searchQuery, locationQuery)
      // if there is predefinedQuery && predefinedLocation
    } else if (predefinedQuery && predefinedLocation) {
      query = appendDoubleQueryPattern(predefinedQuery, predefinedLocation)
      // if filter is 2 but there is no predefinedQuery or predefinedLocation
    } else if (!predefinedQuery && !predefinedLocation && !filterQuery && !locationQuery) {
      query = appendGeneralQueryPattern()
      // if there is predefinedQuery but no predefinedLocation but there is location match
    } else if (predefinedQuery && !predefinedLocation && locationQuery) {
      query = appendDoubleQueryPattern(predefinedQuery, locationQuery)
      // if filter is 2, there is no predefinedQuery, but there is predefinedLocation, it means it hit reserved keyword
    } else if (!predefinedQuery && predefinedLocation) {
      query = appendDoubleQueryPattern(filterQuery, predefinedLocation)
    }
  } else {
    if (searchQuery) {
      query = appendSingleQueryPattern(searchQuery)
    } else {
      query = appendGeneralQueryPattern()
    }
  }

  const queryData = urlQueryParser(query)

  //  if query value exist in filterParamsObject, remove it
  queryData.forEach((q) => {
    for (const [key, value] of Object.entries(filterParamsObject)) {
      let valueArray = value.split(',')
      if (value.includes(q)) {
        valueArray = valueArray.filter((val) => val !== q)
      }
      if (valueArray.length === 0) {
        delete filterParamsObject[key]
      } else {
        filterParamsObject = {
          ...filterParamsObject,
          [key]: valueArray.join(),
        }
      }
    }
  })
  const data = {
    searchQuery: query,
    // searchQuery: predefinedQuery && optionValue.length > 0 ? predefinedQuery : filterQuery,
    // filters: combinedMatchedConfig,
    // filterParamsString: filterParams,
    filterParamsObject,
  }

  return data
}

const moreFilterDataParser = (newValue, routerQuery, config) => {
  const { keyword } = routerQuery
  const queryParser = urlQueryParser(keyword)
  const locationList = getLocationList(config)
  const industryList = config.inputs.industry_lists
  const expLvlList = config.inputs.xp_lvls
  const eduLevelList = config.filters.educations
  const jobTypeList = config.inputs.job_types
  const salaryRangeList = config.filters.salary_range_filters.map((range) => ({
    key: range.key === '10K - 30K' ? 'Below 30K' : range.key,
    value: range.value === '10K - 30K' ? 'Below 30K' : range.value,
    ['seo-value']: range['seo-value'],
  }))

  const sanitisedConfig = {
    industry: industryList,
    jobType: jobTypeList,
    salary: salaryRangeList,
    workExperience: expLvlList,
    qualification: eduLevelList,
    location: locationList,
  }

  let isSingleFilter = false
  let matchedConfig = {}
  let predefinedQuery = ''
  let filterData = {}

  // for case: XXXX-jobs -> queryParser length will always be 1
  Object.keys(sanitisedConfig).forEach((key) => {
    // handle predefined filters from url
    // iterate based on number of results from queryParser
    queryParser.forEach((parsedData, index) => {
      const hasMatch = sanitisedConfig[key].filter((data) => {
        return data['seo-value'] === parsedData
      })

      if (hasMatch.length > 0) {
        matchedConfig = {
          ...matchedConfig,
          [key]: hasMatch,
        }
      }

      // if parsedData has index of 0, and it has no matches, it is a predefinedQuery
      if (index === 0 && hasMatch.length === 0) predefinedQuery = parsedData
      // if parsedData has index of 1, it means it has a predefined location
    })
    // handle filters from user actions
    for (const [key, value] of Object.entries(newValue)) {
      // only proceed if it is not a non filter key
      if (!nonFilterKeys.includes(key)) {
        // only proceed if value is not null && not empty
        if (value && value.length !== 0) {
          // handle filters not under 'More filters' section
          
          filterData = {
            ...filterData,
            // ensure to only push unduplicated results
            [key]: Array.from(new Set(value)).join(','),
          }
          const hasMatch = []
          value.forEach((val) => {
            const matchedFilter = sanitisedConfig[key]?.filter((data) => {
              return data['seo-value'] === val
            })
            hasMatch.push(matchedFilter[0])
          })
          matchedConfig = {
            ...matchedConfig,
            [key]: hasMatch,
          }
        }
      }
    }
  })

  // check if only single filter is applied
  if (Object.keys(matchedConfig).length === 1) {
    if (Object.values(matchedConfig).length === 1) {
      const stringValue = Object.values(matchedConfig)[0] || ''
      if (stringValue.length === 1) {
        isSingleFilter = true
      }
    }
  }

  // sanitise filter data to be passed as query params
  const filterParams = buildQueryParams(matchedConfig)

  let filterParamsObject = {}
  Object.keys(matchedConfig).map((key) => {
    const matchy = matchedConfig[key]
      .map((filter) => {
        if (filter) return filter['seo-value']
        // return filter['seo-value']
      })
      .join()
    filterParamsObject = {
      ...filterParamsObject,
      [key]: matchy,
    }
  })

  let filterQuery = ''
  // if only single filter is applied && no predefinedQuery, that single filter will be the search query
  // remove searchQuery filter from matchedConfig
  if (!predefinedQuery && isSingleFilter) {
    filterQuery = Object.values(matchedConfig)[0][0]['seo-value']
    filterQuery = `${filterQuery}-jobs`
    filterParamsObject = {}
  }

  const data = {
    searchQuery: predefinedQuery ? predefinedQuery : filterQuery,
    filters: matchedConfig,
    filterParamsString: filterParams,
    filterParamsObject,
  }

  return data
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
          return loc.value.toLowerCase() === unslugify(value)
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
    predefinedLocation,
  }
}

// e.g of url = query-jobs?
const appendSingleQueryPattern = (query) => {
  // query can be value from user query OR location OR category
  if (query && query.length !== 0 && !query.includes('job-search')) {
    return query + '-jobs'
  }
  return query && query.length === 0 ? '' : query
}

// e.g of url = query-jobs-in-location?
const appendDoubleQueryPattern = (query, location) => {
  // query can be value from user query OR category
  return query && location ? query + '-jobs-in-' + location : null
}

// e.g of url = job-search?
const appendGeneralQueryPattern = () => {
  return 'job-search'
}

const conditionChecker = (queryType, sanitisedLocValue, jobCategory, clearAllFilters = false) => {
  let queryParam = ''
  // eslint-disable-next-line
  // query && !location && !category
  if (queryType && !sanitisedLocValue && !jobCategory) {
    queryParam = appendSingleQueryPattern(queryType)
  } else if (
    // !query && 1 location && !category
    !queryType &&
    sanitisedLocValue &&
    !jobCategory
  ) {
    queryParam = appendSingleQueryPattern(sanitisedLocValue)
  } else if (
    // !query && !location && 1 category
    !queryType &&
    !sanitisedLocValue &&
    jobCategory
  ) {
    queryParam = appendSingleQueryPattern(jobCategory)
  }

  // query && 1 location && !category
  if (queryType && sanitisedLocValue && !jobCategory) {
    queryParam = appendDoubleQueryPattern(queryType, sanitisedLocValue)
  }

  // query && !location && 1 category
  if (queryType && !sanitisedLocValue && jobCategory) {
    queryParam = appendSingleQueryPattern(queryType)
  }

  // !query && 1 location && 1 category
  if (!queryType && sanitisedLocValue && jobCategory) {
    queryParam = appendDoubleQueryPattern(jobCategory, sanitisedLocValue)
  }

  // query && 1 location && 1 category
  if (queryType && sanitisedLocValue && jobCategory) {
    queryParam = appendDoubleQueryPattern(queryType, sanitisedLocValue)
  }

  // If clearAllFilters is true, only extract searchQuery
  if (clearAllFilters) {
    if (queryType && queryParser && queryParser.length > 0) {
      const matchedLocation = locationList.filter((loc) => {
        return loc.value === unslugify(queryParser[0])
      })
      const matchedCategory = categoryList.filter((cat) => {
        return cat.value === queryParser[0]
      })
      if (
        (!matchedLocation && !matchedCategory) ||
        (matchedLocation &&
          matchedLocation.length === 0 &&
          matchedCategory &&
          matchedCategory.length === 0)
      ) {
        queryParam = appendSingleQueryPattern(queryParser[0])
      }
    } else if (!queryType && queryParser && queryParser.length > 0) {
      queryParam = ''
    }
  }

  // If !query, !jobLocation && !jobCategory
  if (!queryType && !sanitisedLocValue && !jobCategory) {
    queryParam = ''
  }

  return slugify(queryParam).toLowerCase()
}

const getLocationList = (config) => {
  if (!config) return []

  const locList =
    config &&
    config.inputs &&
    config.inputs.location_lists
      .map((region) =>
        region.locations.map((loc) => ({
          ...loc,
          // loc value all lower case
          value: loc.value,
        }))
      )
      .reduce((a, c) => a.concat(c), [])

  return locList
}

const getSmsCountryList = (config) => {
  if (!config) return []

  const smsCountryList = []
  const countryList = config?.inputs?.country_lists
  countryList.forEach((country) => {
    if (country.is_sms_allowed) {
      const smsCountry = {
        value: country['code'],
        label: country['code'] + ' (' + country['value'] + ')',
      }

      smsCountryList.push(smsCountry)
    }
  })

  return smsCountryList
}

const getSmsCountryCode = (phoneNumber, sms_country_list) => {
  return sms_country_list.filter((country) => {
    return country.value.includes(phoneNumber)
  })
}

const getJobCategoryList = (config) => {
  if (!config) return []

  const categories = []

  config?.inputs?.job_category_lists.forEach((mainCategory) => {
    mainCategory.sub_list.forEach((subList) => {
      categories.push(subList.value)
    })
  })

  return categories
}

const getJobCategoryIds = (config, categories) => {
  if (!config) return []

  const categoryLists = config?.inputs?.job_category_lists
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
  return config?.inputs?.notice_period_lists.map((notice) => ({
    ...notice,
    label: notice.value,
    value: notice.id,
  }))
}

const getSalaryOptions = (config, salaryFrom, hasComparedTo) => {
  if (!config) return null
  const salaryConfig = config?.inputs?.salary_ranges
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

  const countryLists = config?.inputs?.country_lists
  if (countryLists && countryLists.length === 0) return countryLists

  let countryOptions = countryLists.map((country) => {
    return {
      label: country.value,
      value: country.value,
      key: country.key,
    }
  })

  countryOptions = countryOptions.filter((country) => country.key !== 'ph')

  return countryOptions
}

const getIndustryList = (config) => {
  if (!config) return []

  const industryList = config?.inputs?.industry_lists
  if (industryList && industryList.length === 0) return industryList

  return industryList.map((industry) => {
    return {
      label: industry.value,
      value: industry.value,
      key: industry.key,
    }
  })
}

const getDegreeList = (config) => {
  if (!config) return []

  const degreeList = config?.inputs?.degrees
  if (degreeList && degreeList.length === 0) return degreeList

  return degreeList.map((degree) => {
    return {
      label: degree.value,
      value: degree.value,
      key: degree.key,
    }
  })
}

const getApplyJobLink = (job, user, accessToken = null) => {
  const oldProjectApplyLink = authPathToOldProject(
    accessToken,
    `/dashboard/job/${slugify(job?.job_title, { lower: true, remove: /[*+~.()'"!:@]/g })}-${
      job?.id
    }/apply`
  )

  if (user) {
    if (!user?.is_profile_completed) {
      return '/jobseeker-complete-profile/1?redirect=' + oldProjectApplyLink
    }

    if (job?.external_apply_url) {
      return job?.external_apply_url
    }
  }

  return oldProjectApplyLink
}

export {
  handleSalary,
  urlQueryParser,
  categoryParser,
  capitalizeFirstAlphabet,
  SEOJobSearchMetaBuilder,
  getPredefinedParamsFromUrl,
  formatLocationConfig,
  conditionChecker,
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
  moreFilterDataParser,
  userFilterSelectionDataParser,
  checkFilterMatch,
}
