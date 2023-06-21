import { flatMap } from 'lodash-es'

export function getAlertData(searchValues: Record<string, any>, config: Record<string, any>) {
  const industryList = config.industry_lists
  const functionsTitleList = config.function_titles
  const jobFunctionList = config.main_functions.map(e=>e.children).flat()
  const locationLists = flatMap(config.location_lists, (item) => item.locations)
  const qualificationList = config.educations
  const salaryList = config.salary_range_filters
  const workExperienceList = config.xp_lvls
  const jobTypeList = config.job_types

  function getValue(values, items, compareKey = 'seo-value', property = 'id') {
    return values
      ?.map?.((key) => items.find((item) => item?.[compareKey] === key)?.[property])
      .join(',')
  }

  
  const location_ids = getValue(searchValues.location, locationLists, 'seo_value')
  const location_values = getValue(searchValues.location, locationLists, 'seo_value', 'value')
  // leve1
  const main_job_function_ids = getValue(
    searchValues?.mainFunctions,
    config.main_functions,
    'seo_value'
  ) // ?.map?.(seo => mainFunctionList.find(item => item. === seo)?.value)?.join?.(',')

  // leve2
  const job_function_ids = getValue(
    searchValues?.jobFunctions,
    jobFunctionList,
  )

 // leve3
 const function_job_title_ids = getValue(
  searchValues?.functionTitles,
  functionsTitleList,
  'seo_value',
)

  const main_function_values = getValue(
    searchValues?.functionTitles,
    functionsTitleList,
    'seo_value',
    'value'
  )
  const industry_ids = getValue(searchValues.industry, industryList)
  const industry_values = getValue(searchValues.industry, industryList, undefined, 'value')
  const xp_lvl_ids = getValue(searchValues.workExperience, workExperienceList)
  const xp_lvl_values = getValue(
    searchValues.workExperience,
    workExperienceList,
    undefined,
    'value'
  )
  const degree_ids = getValue(searchValues.qualification, qualificationList)
  const degree_values = getValue(searchValues.qualification, qualificationList, undefined, 'value')
  const job_type_ids = getValue(searchValues.jobType, jobTypeList)
  const job_type_values = getValue(searchValues.jobType, jobTypeList, undefined, 'value')
  const salary_range_filter_ids = getValue(searchValues.salary, salaryList)
  const salary_range_values = getValue(searchValues.salary, salaryList, undefined, 'value')

  return {
    location_ids,
    location_values,
    main_job_function_ids,
    job_function_ids,
    function_job_title_ids,
    main_function_values,
    industry_ids,
    industry_values,
    xp_lvl_ids,
    xp_lvl_values,
    degree_ids,
    degree_values,
    job_type_ids,
    job_type_values,
    salary_range_filter_ids,
    salary_range_values
  }
}