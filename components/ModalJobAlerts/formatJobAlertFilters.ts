import { getValueById } from "helpers/config/getValueById"

export const formatJobAlertFilter = (config, alert) => {
  const { main_job_functions
    , industries, xp_lvls, degrees, job_types,
    salary_range_filters, is_company_verified
  } = alert
  const jobFunTitle = main_job_functions?.map(item => {
    return getValueById(config, item.id, 'main_job_function_id')
  })?.join(',')

  const industry = industries?.map(item => getValueById(config, item.id, 'industry_id'))?.join(',')
  const xps = xp_lvls?.map(item => getValueById(config, item.id, 'xp_lvl_id'))?.join(',')
  const dgs = degrees?.map(item => getValueById(config, item.id, 'degree_id'))?.join(',')
  const jobTypes = job_types?.map(item => getValueById(config, item.id, 'job_type_id'))?.join(',')
  const salaries = salary_range_filters?.map(item => getValueById(config, item.id, 'salary_range_filter_id'))?.join(',')

  const result = [jobFunTitle, industry, xps, dgs, jobTypes, salaries].filter(item => !!item).join(',')
  return result
}