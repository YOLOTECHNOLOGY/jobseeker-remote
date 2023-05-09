import { getIdPath } from "helpers/config/getIdPath"
import { getValueById } from "helpers/config/getValueById"

export const changeCompanyValueWithConfigure = (companyDetail, config) => [
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
      getIdPath((item.pathKey || item.idKey) as any).slice(1)
    )
  })
]