import configuredAxios from 'helpers/configuredAxios'
const toSeo = value => value.replaceAll('/', '-').replaceAll(' ', '-').toLowerCase()
import { flatMap } from 'lodash-es'
import { getCountryKey, getLang, getLanguageCode } from 'helpers/country'
import { memoizeWithTime } from 'helpers/cache'

const mainJobfunctions2Jobfunctions = main => {
  return main.map(item => ({
    [item.value]: item.sub_function_list
  }))
}

const getConfig = memoizeWithTime(
  (countryKey, lang) => {
    const axios = configuredAxios('config', 'public')
    return axios.get(`${countryKey}/list?language_code=${lang}`)
  },
  (countryKey, lang) => countryKey + lang,
  36000
)
const fetchConfigService = (defaultLang) => {
  const [countryKey, lang] = [
    getCountryKey(),
    getLanguageCode(defaultLang)
    ||
    getLanguageCode(getLang())]

  return getConfig(countryKey, lang)
    .then(data => {
      const result = data.data.data
      // const jobFunctions = result.job_function_lists
      const jobFunctions = result.main_job_function_lists

      result.main_functions = jobFunctions.map((item) => {
        return {
          value: item.value,
          key: toSeo(item['seo-value']),
          seo_value: toSeo(item['seo-value']),
          id: item.id,
          children: item.sub_function_list
        }
      })
      result.job_functions = flatMap(result.main_functions, item => item.children?.map?.(item => {
        return {
          key: toSeo(item['seo-value']),
          seo_value: toSeo(item['seo-value']),
          children: item.job_titles,
          value: item.value,
          id: item.id
        }
      }) ?? [])
      result.function_titles = flatMap(result.job_functions, item => item.children?.map?.(item => {
        return {
          key: toSeo(item['seo-value']) + '-' + item.id,
          seo_value: toSeo(item['seo-value']) + '-' + item.id,
          function_title_value: toSeo(item['seo-value']),
          value: item.value,
          id: item.id
        }
      }) ?? [])
      result.job_function_lists = mainJobfunctions2Jobfunctions(result.main_job_function_lists ?? [])
      return result
    })
}

export { fetchConfigService }
