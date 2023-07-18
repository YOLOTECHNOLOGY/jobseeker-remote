import { defaultLanguage, languages } from "helpers/country"

export const i18n = {
  defaultLocale: defaultLanguage(),
  locales: languages.map(item => item.value),
} as const

export type Locale = typeof i18n['locales'][number]
