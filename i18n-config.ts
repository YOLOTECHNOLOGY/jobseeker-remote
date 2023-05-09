export const i18n = {
    defaultLocale: 'en-US',
    locales: ['en-US', 'id-id','zh-CN'],
  } as const
  
  export type Locale = typeof i18n['locales'][number]