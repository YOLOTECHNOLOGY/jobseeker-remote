import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AppProps } from 'next/app'
import { wrapper } from 'store'
import { CookiesProvider } from 'react-cookie'
import 'styles/globals.scss'
import Script from 'next/script'
import * as gtag from 'lib/gtag'

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      {/* Google AdSense */}
      <Script
        data-ad-client='ca-pub-4245733463545444'
        async
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      ></Script>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id='gtag-init'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      {/* Google Ad Manager */}
      <Script async src='https://securepubads.g.doubleclick.net/tag/js/gpt.js'></Script>
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            window.googletag = window.googletag || {cmd: []}
          `,
        }}
      ></Script>

      {/* Google One Tap Sign in */}
      <Script src="https://accounts.google.com/gsi/client" async defer/>
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            window.onload = function () {
              google.accounts.id.initialize({
                client_id: '197019623682-n8mch4vlad6r9c6t3vhovu01sartbahq.apps.googleusercontent.com',
                callback: handleGoogleOneTapLoginResponse,
                cancel_on_tap_outside: false
              });
              google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                  console.log(notification.getNotDisplayedReason())
                }
              });
            };

            function handleGoogleOneTapLoginResponse(CredentialResponse) {
              var accessToken = CredentialResponse.credential;
              var activeKey = 1;
              if (window.location.pathname.includes('/employer')) {
                activeKey = 2;
              }
              window.location.replace("/api/googleLoginHandler?access_token=" + accessToken + "&active_key=" + activeKey);
            }
          `
        }}
      />
      <CookiesProvider>
        <Component {...pageProps} />
      </CookiesProvider>
    </>
  )
}

export default wrapper.withRedux(App)
