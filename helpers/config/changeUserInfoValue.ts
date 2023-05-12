import { getValueById } from "helpers/config/getValueById"

export const changeUserInfoValue = (userInfo, config) => {
  [
    {
      property: 'xp_lvl',
      idKey: 'xp_lvl_id'
    },
    {
      property: 'location',
      idKey: 'location_id'
    },
    {
      property: 'country',
      idKey: 'country_id',
    }
  ].forEach((item) => {
    userInfo[item.property] = getValueById(
      config,
      userInfo[item.idKey],
      item.idKey
    )
  })
}
export const changeJobPreference = (jobPreference: any[], config) => {
  jobPreference.forEach(item => {
    ['location', 'job_type', 'industry', 'notice_period', 'country'].forEach(key => {
      item[key] = getValueById(
        config,
        item[`${key}_id`],
        `${key}_id`
      )
    })
  })
}