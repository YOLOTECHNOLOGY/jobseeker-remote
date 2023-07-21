// import 'server-only'
import type { Locale } from './i18n-config'
import otaClient from '@crowdin/ota-client';
// import enPageLanguage from './dictionaries/en-US.json'
// import enErrorcode from './errorcode/en-US/errorcode.json'

// import zhPageLanguage from './dictionaries/zh-CN.json'
// import zhErrorcode from './errorcode/zh-CN/errorcode.json'

// import idPageLanguage from './dictionaries/id-ID.json'
// import idErrorcode from './errorcode/id-ID/errorcode.json'

// import jpPageLanguage from './dictionaries/ja-JP.json'
// import jpErrorcode from './errorcode/ja-JP/errorcode.json'

// // We enumerate all dictionaries here for better linting and typescript support
// // We also get the default import for cleaner types
// const enLanguage = { errorcode: enErrorcode, ...enPageLanguage }
// const zhLanguage = { errorcode: zhErrorcode, ...zhPageLanguage }
// const idLanguage = { errorcode: idErrorcode, ...idPageLanguage }
// const jpLanguage = { errorcode: jpErrorcode, ...jpPageLanguage }
// const dictionaries = {
//   'en-US': () => enLanguage,
//   'zh-CN': () => zhLanguage,
//   'id': () => idLanguage,
//   'id-ID': () => idLanguage,
//   'ja-JP': () => jpLanguage
// }
const client = new otaClient('7ebf57665448382c18ccd49ef5z', {
  disableStringsCache: false,
  disableLanguagesCache: true
})

export const getDictionary = async (locale: Locale) => {
  return client.getStringsByLocale(locale)
  // return dictionaries[locale]?.() || dictionaries['en-US']()
}
