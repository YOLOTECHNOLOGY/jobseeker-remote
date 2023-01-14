import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AppProps } from 'next/app'
import { wrapper } from 'store'
import { getCookie, removeCookie } from 'helpers/cookies'
import { CookiesProvider } from 'react-cookie'
import { ConnectedRouter } from 'connected-next-router'
import { PersistGate } from 'redux-persist/integration/react'
import { setItem, getItem } from 'helpers/localStorage'
import { getFromObject } from 'helpers/formatter'
import { jobseekerTokenValidate } from 'store/services/auth/jobseekersTokenValidate'
import Script from 'next/script'
import * as gtag from 'lib/gtag'
const TransitionLoader = dynamic(() => import('components/TransitionLoader/TransitionLoader'))
const MaintenancePage = dynamic(() => import('./maintenance'))
import * as fbq from 'lib/fpixel'
import NotificationProvider from 'components/NotificationProvider'
// import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
// import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
// import { useDispatch } from 'react-redux'
import IMProvider from 'components/Chat/IMProvider.client'
import 'styles/globals.scss'
import { persistor } from 'store'

const App = (props: AppProps) => {
  const { Component, pageProps } = props
  const router = useRouter()
  const accessToken = getCookie('accessToken')

  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [toPath, setToPath] = useState('')

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
    if (!getItem('utmCampaign')) {
      // Save utm keys if found
      const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
      const utmCampaignObj = getFromObject(router.query, campaignKeys)

      if (Object.keys(utmCampaignObj).length > 0) {
        setItem('utmCampaign', JSON.stringify(utmCampaignObj))
      }
    }
    const handleRouteComplete = () => {
      setToPath('')
      setIsPageLoading(false)
    }
    const handleStart = (toPath) => {
      setToPath(toPath)
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

  useEffect(() => {
    const accessToken = getCookie('accessToken')
    if (accessToken) {
      jobseekerTokenValidate(accessToken)
        .then(() => {
          //
        })
        .catch(({ response: { data, status } }) => {
          if (status == 400 || data?.errors?.error[0] === 'Invalid token') {
            if (router.pathname !== '/get-started') {
              removeCookie('accessToken')
              window.location.href = '/get-started?type=LoginOut'
            } else {
              removeCookie('accessToken')
            }
          }
        })
    }
  }, []) // [router.route]

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
      {/* TikTok */}
      <Script
        dangerouslySetInnerHTML={{
          __html: `
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++
      )ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=i+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
          
            ttq.load('CEDEUCRC77UA21H9TRE0');
            ttq.page();
          }(window, document, 'ttq');
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
          ) : isPageLoading &&
            !(router.pathname.includes('jobs-hiring') && toPath.includes('jobs-hiring')) ? (
            <TransitionLoader accessToken={accessToken} />
          ) : (
            <NotificationProvider>
              <PersistGate loading={null} persistor={persistor}>
                <IMProvider>
                  <Component {...pageProps} />
                </IMProvider>
              </PersistGate>
            </NotificationProvider>
          )}
        </CookiesProvider>
      </ConnectedRouter>
    </>
  )
}

export default wrapper.withRedux(App)
