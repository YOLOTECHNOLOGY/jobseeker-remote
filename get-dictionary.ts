// import 'server-only'
import { defaultLanguage, getLang } from 'helpers/country';
import type { Locale } from './i18n-config'
import otaClient from '@crowdin/ota-client';

import enPageLanguage from './dictionaries/en-US.json'
import enErrorcode from './errorcode/en-US/errorcode.json'

import zhPageLanguage from './dictionaries/zh-CN.json'
import zhErrorcode from './errorcode/zh-CN/errorcode.json'

import idPageLanguage from './dictionaries/id-ID.json'
import idErrorcode from './errorcode/id-ID/errorcode.json'

import jpPageLanguage from './dictionaries/ja-JP.json'
import jpErrorcode from './errorcode/ja-JP/errorcode.json'
import { isEmpty } from 'ramda'
// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const enLanguage = { errorcode: enErrorcode, ...enPageLanguage }
const zhLanguage = { errorcode: zhErrorcode, ...zhPageLanguage }
const idLanguage = { errorcode: idErrorcode, ...idPageLanguage }
const jpLanguage = { errorcode: jpErrorcode, ...jpPageLanguage }
const dictionaries = {
  'en-US': () => enLanguage,
  'zh-CN': () => zhLanguage,
  'id': () => idLanguage,
  'id-ID': () => idLanguage,
  'ja-JP': () => jpLanguage
}
const client = new otaClient('7ebf57665448382c18ccd49ef5z', {
  disableStringsCache: false,
  disableLanguagesCache: false
})
client.setCurrentLocale(defaultLanguage())
// client.setCurrentLocale(getLang())
const findMatch = (langKeys, key) => {
  const fullMatch = langKeys.find(item => item === key)
  if (key?.includes('en')) {
    return 'en-US'
  }
  if (fullMatch) {
    return fullMatch
  }
  if (key?.includes('-')) {
    const partMatch = langKeys.find(item => item?.includes(key.split('-')?.[0]))
    if (partMatch) {
      return partMatch
    }
  } else {
    const partMatch2 = langKeys.map(item => key?.includes(item.split('-')?.[0])).find(a => a)
    if (partMatch2) {
      return partMatch2
    }
  }
}

export const getDictionary = async (locale: Locale) => {

  const languages = await client.getStrings()
  const langKeys = Object.keys(languages)
  const match = findMatch(langKeys, locale)
  const dic = await client.getStringsByLocale(match ?? defaultLanguage())
  const errorcode = Object.keys(dic)
    .filter(key => !isNaN(Number(key)))
    .map(key => ({ [key]: dic[key] }))
    .reduce((a, b) => ({ ...a, ...b }), {})
  if (isEmpty(dic)) {
    return dictionaries[locale]?.() || dictionaries['en-US']()
  }
  return { ...dic, errorcode }
}
