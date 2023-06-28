import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import { i18n } from './i18n-config'
import Negotiator from 'negotiator'
import { configKey } from 'helpers/cookies'
import { getCountryKey } from 'helpers/country'
// import log4js from 'log4js'
// log4js.configure({
//     appenders: {
//         clientError: { type: "file", filename: "public/clientError.log" },
//         serverError: { type: "file", filename: "public/serverError.log" },
//         serverInfo: { type: "file", filename: "public/serverInfo.log" },
//     },
//     categories: {
//         clientError: { appenders: ["clientError"], level: "error", enableCallStack: false },
//         serverError: { appenders: ["serverError"], level: "error", enableCallStack: false },
//         serverInfo: { appenders: ["serverInfo"], level: "info", enableCallStack: false },
//         default: { appenders: ["serverError"], level: "error", enableCallStack: false }
//     },
// });
function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales
  const match = languages.find(item => locales.includes(item)) ?? i18n.defaultLocale
  return match
}

export const getCountryAndLang = (cookies: RequestCookies) => {
  const config = cookies.get(configKey)
  if (!config) {
    return null
  }
  return config.value.split('_')
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const fullUrl = pathname + search

  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // // If you have one
  if (
    [
      'manifest.json',
      'favicon.ico',
      'ads.txt',
      'imbackground.js',
      'robots.txt',
      'self_worker.js',
      'vercel.svg',
      'errors/report',
      'clientError.log',
      'serverError.log',
      'getLog',
      'maintenance',
      'images',
      'chat-redirect'
      // Your other files in `public`
    ].filter(item => pathname.includes(item)).length > 0
  ) { return }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
  console.log({ pathnameIsMissingLocale })
  // Redirect if there is no locale
  if (pathnameIsMissingLocale && pathname !== '/') {
    // the a link will not take any geo data on url, but we can get those data by cookies
    const locale = getCountryAndLang(request.cookies) || [getCountryKey(), getLocale(request)]
    const lang = locale?.[1]
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    const res = NextResponse.redirect(new URL(`/${lang}${fullUrl}`, request.url))
    res.cookies.set(configKey, `${locale.join('_')}`, { path: '/' })
    return res
  }

  // const res = NextResponse.next();
  // // Setting cookies in response.
  // // This will be sent back to the browser.
  // res.cookies.set("my-cookie", "my-cookie-value", {
  //   path: "/",
  //   httpOnly: true,
  // });
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // '/(!self_worker)'
    // Optional: only run on root (/) URL
    // '/'
  ],
  unstable_allowDynamic: [
    '/node_modules/lodash-es/**',
  ],
}
