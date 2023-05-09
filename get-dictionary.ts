// import 'server-only'
import type { Locale } from './i18n-config'

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  "en-US": () => import('./dictionaries/en-US.json').then((module) => module.default),
  "zh-CN": () => import('./dictionaries/zh-CN.json').then((module) => module.default),
  "id-ID": () => import('./dictionaries/id-ID.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() || dictionaries['en-US']()
}