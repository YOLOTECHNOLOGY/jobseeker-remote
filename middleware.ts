import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import { i18n } from './i18n-config'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { configKey } from 'helpers/cookies'
import { getCountryKey } from 'helpers/country'

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales
  return matchLocale(languages, locales, i18n.defaultLocale)
}

export const getCountryAndLang = (cookies: RequestCookies) => {
  const config = cookies.get(configKey)
  if (!config) {
    return null
  }
  return config.value.split('_')
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // // If you have one
  if (
    [
      '/manifest.json',
      '/favicon.ico',
      '/ads.txt',
      '/imbackground.js',
      '/robots.txt',
      '/self_worker.js',
      '/vercel.svg'
      // Your other files in `public`
    ].includes(pathname)
  ) { return }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // the a link will not take any geo data on url, but we can get those data by cookies
    const locale = getCountryAndLang(request.cookies) || [getCountryKey(), getLocale(request)]
    const lang = locale?.[1]
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    const res = NextResponse.redirect(new URL(`/${lang}${pathname}`, request.url))
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
