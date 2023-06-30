// import 'server-only'
import type { Locale } from './i18n-config'

import enPageLanguage from './dictionaries/en-US.json'
import enErrorcode from './errorcode/en-US/errorcode.json'

import zhPageLanguage from './dictionaries/zh-CN.json'
import zhErrorcode from './errorcode/zh-CN/errorcode.json'

import idPageLanguage from './dictionaries/id-ID.json'
import idErrorcode from './errorcode/id-ID/errorcode.json'

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const enLanguage = { errorcode: enErrorcode, ...enPageLanguage }
const zhLanguage = { errorcode: zhErrorcode, ...zhPageLanguage }
const idLanguage = { errorcode: idErrorcode, ...idPageLanguage }
const dictionaries = {
  'en-US': () => enLanguage,
  'zh-CN': () => zhLanguage,
  'id': () => idLanguage
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() || dictionaries['en-US']()
}
