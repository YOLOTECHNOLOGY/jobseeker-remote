import { select } from 'redux-saga/effects'

/* Helpers */
import { itemExist, getItem, removeItem } from 'helpers/localStorage'
import { utmCampaignKey } from 'helpers/constants'

const getDeviceData = state => {
  const {
    isDesktop,
    isMobile,
    isTablet,
    operatingSystem
  } = state.utility.setUserDevice.userAgent
  return {
    device_type: isMobile
      ? 'mobile'
      : isTablet
        ? 'tablet'
        : isDesktop
          ? 'desktop'
          : 'unknown',
    device_os: operatingSystem
  }
}

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
