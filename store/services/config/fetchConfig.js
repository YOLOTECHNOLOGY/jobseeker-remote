import configuredAxios from 'helpers/configuredAxios'
const toSeo = value => value.replaceAll('/', '-').replaceAll(' ', '-').toLowerCase()
import { flatMap } from 'lodash-es'
import { getCountryKey, getLang, getLanguageCode } from 'helpers/country'

const mainJobfunctions2Jobfunctions = main => {
  return main.map(item => ({
    [item.value]: item.sub_function_list
  }))
}
const fetchConfigService = (defaultLang) => {
  const axios = configuredAxios('config', 'public')
  const [countryKey, lang] = [
    getCountryKey(),
    getLanguageCode(defaultLang)
    ||
    getLanguageCode(getLang())]
  console.log({ defaultLang, })

  return axios.get(`${countryKey}/list?language_code=${lang}`)
    .then(data => {
      const result = data.data.data
      // const jobFunctions = result.job_function_lists
      const jobFunctions = result.main_job_function_lists

      // result.main_functions = jobFunctions.map((item, index) => {
      //   const key = Object.keys(item)?.[0]
      //   const value = item[key]
      //   return {
      //     value: key,
      //     key: toSeo(key),
      //     seo_value: toSeo(key),
      //     id: index,
      //     children: value
      //   }
      // })
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
