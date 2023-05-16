import { getValueById } from "helpers/config/getValueById"

export const changeAlertValue = (alert: Record<string, any>, config: Record<string, any>) => [
  [
    {
      property: 'frequency_value',
      idKey: 'frequency_id',
      pathKey: 'subscibe_job_frequency_id'
    },
    {
      property: 'location_value',
      idKey: '',
      pathKey: 'location_id'
    },
  ].forEach((item) => {
    alert[item.property] = getValueById(
      config,
      item.property === 'location_value' ? alert.locations?.[0]?.id : alert[item.idKey],
      item.pathKey || item.idKey
    )
  })
]