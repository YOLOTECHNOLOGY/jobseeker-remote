import { getValueById } from "helpers/config/getValueById"

export const changeJobValue = (config, job) => {
  [
    {
      property: 'job_location',
      idKey: 'job_location_id',
      pathKey: 'location_id'
    },
    {
      property: 'job_type',
      idKey: 'job_type_id'
    },
    {
      property: 'xp_lvl',
      idKey: 'xp_lvl_id',
    },
    {
      property: 'company_industry',
      idKey: 'company_industry_id',
      pathKey: 'industry_id'
    },
    {
      property: 'degree',
      idKey: 'degree_id',
    },
    {
      property: 'company_size',
      idKey: 'company_size_id',
    }

  ].forEach((item) => {
    job[item.property] = getValueById(
      config,
      job[item.idKey],
      item.pathKey || item.idKey
    )
  })
  
  const job_benefits = job.job_benefits || []
  job_benefits.forEach(benefit => {
    [{
      property: 'name',
      idKey: 'id',
      pathKey: 'job_benefit_id'
    }].forEach((item) => {
      benefit[item.property] = getValueById(
        config,
        benefit[item.idKey],
        item.pathKey,
        'name'
      )
    })
  })
}
