import { getValueById } from "helpers/config/getValueById"


export const formatJobAlertFilter = (config, job) => {

  const { 
    main_job_functions, 
    job_functions,
    function_job_titles,
    industries,
    company_sizes,
    company_financing_stages,
    xp_lvls, 
    degrees, 
    job_types,
    salary_range_filters
  } = job

  const main_job_functions_values = main_job_functions?.map(item => {
    return getValueById(config, item.id, 'main_job_function_id')
  })?.filter(Boolean).join(',')

  const job_functions_values = job_functions?.map(item => {
    return config.job_functions.find(job_function => job_function.id === item.id)?.value
  })?.filter(Boolean).join(',')

  const function_job_titles_values = function_job_titles?.map(item => {
    return getValueById(config, item.id, 'function_job_title_id')
  })?.filter(Boolean).join(',')
  
  const industries_values = industries?.map(item => getValueById(config, item.id, 'industry_id'))?.filter(Boolean).join(',')
  
  const company_sizes_values = company_sizes?.map(item => getValueById(config, item.id, 'company_size_id'))?.filter(Boolean).join(',')
  
  const company_financing_stages_values = company_financing_stages?.map(item => getValueById(config, item.id, 'company_financing_stage_id'))?.filter(Boolean).join(',')

  const xp_lvls_values = xp_lvls?.map(item => getValueById(config, item.id, 'xp_lvl_id'))?.filter(Boolean).join(',')

  const degrees_values = degrees?.map(item => getValueById(config, item.id, 'degree_id'))?.filter(Boolean).join(',')
  
  const job_types_values = job_types?.map(item => getValueById(config, item.id, 'job_type_id'))?.filter(Boolean).join(',')
  
  const salary_range_filters_values = salary_range_filters?.map(item => getValueById(config, item.id, 'salary_range_filter_id'))?.filter(Boolean).join(',')

  const result = [
    main_job_functions_values,
    job_functions_values,
    function_job_titles_values,
    industries_values,
    company_sizes_values,
    company_financing_stages_values,
    xp_lvls_values,
    degrees_values,
    job_types_values,
    salary_range_filters_values
  ]

  return result
}