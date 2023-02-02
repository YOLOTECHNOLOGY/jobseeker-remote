import configuredAxios from 'helpers/configuredAxios'
const toSeo = value => value.replaceAll('/', '-').replaceAll(' ','-').toLowerCase()
import { flatMap } from 'lodash-es'

const fetchConfigService = () => {
  const axios = configuredAxios('config', 'public')
  return axios.get(`/list`)
    .then(data => {
      const result = data.data.data
      const jobFunctions = result.inputs.job_function_lists
      result.inputs.main_functions = jobFunctions.map((item, index) => {
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
      result.inputs.job_functions = flatMap(result.inputs.main_functions, item => item.children?.map?.(item => {
        return {
          key: toSeo(item.value),
          seo_value: toSeo(item.value),
          children: item.job_titles,
          value: item.value,
          id: item.id
        }
      })??[])
      result.inputs.function_titles = flatMap(result.inputs.job_functions, item => item.children?.map?.(item => {
        return {
          key: toSeo(item.value) + '-' + item.id,
          seo_value: toSeo(item.value) + '-' + item.id,
          function_title_value: toSeo(item.value),
          value: item.value,
          id: item.id
        }
      })??[])
      return result
    })
}

export { fetchConfigService }
