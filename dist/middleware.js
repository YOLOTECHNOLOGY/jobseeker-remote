import { NextResponse } from 'next/server';
import { i18n } from './i18n-config';
import Negotiator from 'negotiator';
import { configKey } from 'helpers/cookies';
import { getCountryKey } from 'helpers/country';
function getLocale(request) {
    var _a;
    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
    // Use negotiator and intl-localematcher to get best locale
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    // @ts-ignore locales are readonly
    const locales = i18n.locales;
    const match = (_a = languages.find(item => locales.includes(item))) !== null && _a !== void 0 ? _a : i18n.defaultLocale;
    return match;
}
export const getCountryAndLang = (cookies) => {
    const config = cookies.get(configKey);
    if (!config) {
        return null;
    }
    return config.value.split('_');
};
export function middleware(request) {
    const { pathname, search } = request.nextUrl;
    const fullUrl = pathname + search;
    // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
    // // If you have one
    if ([
        '/manifest.json',
        '/favicon.ico',
        '/ads.txt',
        '/imbackground.js',
        '/robots.txt',
        '/self_worker.js',
        '/vercel.svg',
        '/errors/report',
        '/clientError.log',
        '/serverError.log',
        '/getLog'
        // Your other files in `public`
    ].includes(pathname)) {
        return;
    }
    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = i18n.locales.every((locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`);
    console.log({ pathnameIsMissingLocale });
    // Redirect if there is no locale
    if (pathnameIsMissingLocale && pathname !== '/') {
        // the a link will not take any geo data on url, but we can get those data by cookies
        const locale = getCountryAndLang(request.cookies) || [getCountryKey(), getLocale(request)];
        const lang = locale === null || locale === void 0 ? void 0 : locale[1];
        // e.g. incoming request is /products
        // The new URL is now /en-US/products
        const res = NextResponse.redirect(new URL(`/${lang}${fullUrl}`, request.url));
        res.cookies.set(configKey, `${locale.join('_')}`, { path: '/' });
        return res;
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
    ],
    unstable_allowDynamic: [
        '/node_modules/lodash-es/**',
    ],
};