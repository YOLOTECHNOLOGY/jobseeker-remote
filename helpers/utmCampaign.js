import { select } from 'redux-saga/effects'

/* Helpers */
import { itemExist, getItem, removeItem } from 'helpers/localStorage'
import { utmCampaignKey } from 'helpers/constants'


function* getUtmCampaignData() {
  const utmCampaign = itemExist(utmCampaignKey)
    ? (() => {
      const utmCampaign = JSON.parse(getItem(utmCampaignKey))
      return { ...utmCampaign }
    })()
    : {}
  // const deviceData = yield select(getDeviceData)

  return {
    ...utmCampaign,
    // ...deviceData
  }
}

const removeUtmCampaign = () => {
  if (itemExist(utmCampaignKey)) {
    removeItem(utmCampaignKey)
  }
}

export { getUtmCampaignData, removeUtmCampaign }
