import { getValueById } from "helpers/config/getValueById"

export const changeCompanyValueWithConfigure = (companyDetail, config) => {
  [
    {
      property: 'company_size',
      idKey: 'company_size_id'
    },
    {
      property: 'industry',
      idKey: 'industry_id'
    },
    {
      property: 'financing_stage',
      idKey: 'financing_stage_id',
      pathKey: 'company_financing_stage_id'
    }
  ].forEach((item) => {
    companyDetail[item.property] = getValueById(
      config,
      companyDetail[item.idKey],
      item.pathKey || item.idKey
    )
  })
}


export const changeJobOnCompany = (job, config) => {
  [
    {
      property: 'job_type',
      idKey: 'job_type_id'
    },
    {
      property: 'job_location',
      idKey: 'job_location_id',
      pathKey: 'location_id',
    }
  ].forEach((item) => {
    job[item.property] = getValueById(
      config,
      job[item.idKey],
      item.pathKey || item.idKey
    )
  })
}