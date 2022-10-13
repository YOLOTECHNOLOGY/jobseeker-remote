import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AppProps } from 'next/app'
import { wrapper } from 'store'
import { getCookie } from 'helpers/cookies'
import { CookiesProvider } from 'react-cookie'
import { ConnectedRouter } from 'connected-next-router'

import { setItem, getItem } from 'helpers/localStorage'
import { getFromObject } from 'helpers/formatter'
import 'styles/globals.scss'
import Script from 'next/script'
import * as gtag from 'lib/gtag'
const TransitionLoader = dynamic(() => import('components/TransitionLoader/TransitionLoader'))
const MaintenancePage = dynamic(() => import('./maintenance'))
import * as fbq from 'lib/fpixel'
import NotificationProvider from 'components/NotificationProvider'

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  const accessToken = getCookie('accessToken')
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)

  useEffect(() => {
    // Facebook pixel
    // This pageview only triggers the first time
    fbq.pageview()

    const handleRouteComplete = (url) => {
      gtag.pageview(url)
      fbq.pageview()
    }

    router.events.on('routeChangeComplete', handleRouteComplete)

    return () => {
      router.events.off('routeChangeComplete', handleRouteComplete)
    }
  }, [router.events])

  useEffect(() => {
    // TODO There is no way to verify the TOKEN of 3.0, and the entrance to obtain TOKEN in 2.0 is not all closed
    // Validate token on every protected page navigation
    // if (accessToken) {
    //   fetch(`${process.env.AUTH_BOSSJOB_URL}/token/validate`, {
    //     method: 'POST',
    //     headers: new Headers({
    //       Authorization: 'Bearer ' + getCookie('accessToken')
    //     })
    //   }).then((resp) => {
    //     if (resp.status !== 200) {
    //       removeCookie('user')
    //       removeCookie('accessToken')
    //       removeCookie('splan')
    //       if (typeof window !== 'undefined') {
    //         window.location.href = '/'
    //       }
    //     }
    //   })
    // }
  }, [router])

  useEffect(() => {
    if (!getItem('utmCampaign')) {
      // Save utm keys if found
      const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
      const utmCampaignObj = getFromObject(router.query, campaignKeys)

      if (Object.keys(utmCampaignObj).length > 0) {
        setItem('utmCampaign', JSON.stringify(utmCampaignObj))
      }
    }
    const handleRouteComplete = () => {
      setIsPageLoading(false)
    }
    const handleStart = () => {
      setIsPageLoading(true)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeError', handleRouteComplete)
    router.events.on('routeChangeComplete', handleRouteComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeError', handleRouteComplete)
      router.events.off('routeChangeComplete', handleRouteComplete)
    }
  }, [])

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`} />
      <Script
        id='gtag-init'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `
        }}
      />

      {/* Google One Tap Sign in */}
      <Script src='https://accounts.google.com/gsi/client' />
      {!accessToken && (
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              window.onload = function () {
                google.accounts.id.initialize({
                  client_id: '197019623682-n8mch4vlad6r9c6t3vhovu01sartbahq.apps.googleusercontent.com',
                  callback: handleGoogleOneTapLoginResponse,
                  cancel_on_tap_outside: false,
                  itp_support: true,
                  skip_prompt_cookie: 'accessToken'
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
                window.location.replace("/handlers/googleLoginHandler?access_token=" + accessToken + "&active_key=" + activeKey);
              }
            `
          }}
        />
      )}

      {/* Facebook  */}
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            function initialize() {	
              FB.init({	
                appId            : ${
                  process.env.ENV === 'production' ? '2026042927653653' : '2111002932479859'
                },
                xfbml            : true,	
                version          : 'v6.0'	
              });	
            };	

            if(window.FB === undefined) {	
              window.fbAsyncInit = function() {	
                initialize();	
              };	
            }	else {	
              initialize();	
            }	

            (function(d, s, id){	
              var js, fjs = d.getElementsByTagName(s)[0];	
              if (d.getElementById(id)) {return;}	
              js = d.createElement(s); js.id = id;	
              js.src = "https://connect.facebook.net/en_US/sdk.js";	
              fjs.parentNode.insertBefore(js, fjs);	
            }(document, 'script', 'facebook-jssdk'));	

            // Fb pixel
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${fbq.FB_PIXEL_ID});
            `
        }}
      />

      {/* Favicons */}
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href={`${process.env.S3_BUCKET_URL}/apple-touch-icon.png`}
      />
      <link
        rel='icon'
        type='image/png'
        sizes='144x144'
        href={`${process.env.S3_BUCKET_URL}/favicon_144x144.png`}
      />
      <link
        rel='icon'
        type='image/png'
        sizes='96x96'
        href={`${process.env.S3_BUCKET_URL}/favicon_96x96.png`}
      />
      <link
        rel='icon'
        type='image/png'
        sizes='48x48'
        href={`${process.env.S3_BUCKET_URL}/favicon_48x48.png`}
      />
      <link
        rel='shortcut icon'
        type='image/x-icon'
        href={`${process.env.S3_BUCKET_URL}/favicon.ico`}
      />

      <ConnectedRouter>
        <CookiesProvider>
          {process.env.MAINTENANCE === 'true' ? (
            <MaintenancePage {...pageProps} />
          ) : isPageLoading && !router.pathname.includes('jobs-hiring') ? (
            <TransitionLoader accessToken={accessToken} />
          ) : (
            <NotificationProvider>
              <Component {...pageProps} />
            </NotificationProvider>
          )}
        </CookiesProvider>
      </ConnectedRouter>
    </>
  )
}

export default wrapper.withRedux(App)
