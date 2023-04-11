import configuredAxios from 'helpers/configuredAxios'
const toSeo = value => value.replaceAll('/', '-').replaceAll(' ', '-').toLowerCase()
import { flatMap } from 'lodash-es'
import { getCountryKey } from 'helpers/country'
const fetchConfigService = () => {
  const axios = configuredAxios('config', 'public')
  const countryKey = getCountryKey()
  return axios.get(`${countryKey}/list`)
    .then(data => {
      const result = data.data.data
      const jobFunctions = result.job_function_lists
      result.main_functions = jobFunctions.map((item, index) => {
        const key = Object.keys(item)?.[0]
        const value = item[key]
        return {
          value: key,
          key: toSeo(key),
          seo_value: toSeo(key),
          id: index,
          children: value
        }
      })
      result.job_functions = flatMap(result.main_functions, item => item.children?.map?.(item => {
        return {
          key: toSeo(item.value),
          seo_value: toSeo(item.value),
          children: item.job_titles,
          value: item.value,
          id: item.id
        }
      }) ?? [])
      result.function_titles = flatMap(result.job_functions, item => item.children?.map?.(item => {
        return {
          key: toSeo(item.value) + '-' + item.id,
          seo_value: toSeo(item.value) + '-' + item.id,
          function_title_value: toSeo(item.value),
          value: item.value,
          id: item.id
        }
      }) ?? [])
      return result
    })
}

export { fetchConfigService }
