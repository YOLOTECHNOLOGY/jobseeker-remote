'use client'
import { useFirstRender } from 'helpers/useFirstRender'
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation';
import { initFireBase } from 'helpers/fireBaseManager'
import Script from 'next/script'
import * as fbq from 'lib/fpixel'
import * as gtag from 'lib/gtag'
import { getCookie } from 'helpers/cookies';

const tiktokfunc = () => {
  const w = window as any
  const t = 'ttq'
  w.TiktokAnalyticsObject = t; const ttq = w[t] = w[t] || [];
  const e = 'CGUHCV3C77U5RBGMKBDG'
  ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = i, ttq._t = ttq._t || {},
    ttq._i = ttq._i || {}
  ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = {}
  // eslint-disable-next-line prefer-rest-params, no-var
  ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"], ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } }; for (var i = 0; i < ttq.methods.length; i++)ttq.setAndDefer(ttq, ttq.methods[i]); ttq.instance = function (t) {
    for (let e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++
    ) {
      ttq.setAndDefer(e, ttq.methods[n]);
      return e
    }
  }
}
const runInClient = (searchParams) => {
  if (!(window as any)?.imSharedWorker && window.SharedWorker) {
    (window as any).imSharedWorker = new SharedWorker('/imbackground.js', 'imbackground')
  }
  const devTools = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__
  if (!!devTools && devTools['inject']) {
    devTools['inject'] = Function.prototype
  }
  initFireBase()
  tiktokfunc()
  invokeGAAdsEvent(searchParams)
}

const invokeGAAdsEvent = (searchParams) => {
  const ads = searchParams.get('ads')
  const gtag = (window as any)?.gtag
  if (process.env.ENV === 'production' && ads && gtag) {
    gtag('event', ads)
  }
}
const accessToken = getCookie('accessToken')

const Initial = () => {
  const firstRender = useFirstRender()
  const searchParams = useSearchParams()
  useEffect(() => {
    if (firstRender) {
      runInClient(searchParams)
    }
  }, [firstRender])
  useEffect(() => {
    gtag.pageview(location.pathname)
    fbq.pageview()
  }, [])
  return <>
    <Script
      strategy='afterInteractive'
      src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`} />
    <Script
      strategy='afterInteractive'
      id='gtag-init'
    >{
        `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `
      } </Script>
    {/* Facebook  */}
    <Script
      strategy='afterInteractive'
    >{`
    function initialize() {	
      FB.init({	
        appId            : ${process.env.ENV === 'production' ? '2026042927653653' : '2111002932479859'
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
    `}</Script>
    {/* Google One Tap Sign in */}
    <Script
      src='https://accounts.google.com/gsi/client'
      strategy='afterInteractive'
      onReady={() => {
        if (!accessToken) {
          const google = (window as any)?.google
          if (!google) return
          google.accounts.id.initialize({
            client_id: '197019623682-n8mch4vlad6r9c6t3vhovu01sartbahq.apps.googleusercontent.com',
            callback: handleGoogleOneTapLoginResponse,
            cancel_on_tap_outside: false,
            itp_support: true,
            skip_prompt_cookie: 'accessToken'
          })
          google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            }
          })
          function handleGoogleOneTapLoginResponse(CredentialResponse) {
            const accessTokenGoogle = CredentialResponse.credential
            let activeKey = 1
            if (window.location.pathname.includes('/employer')) {
              activeKey = 2
            }
            window.location.replace(
              '/handlers/googleLoginHandler?access_token=' +
              accessTokenGoogle +
              '&active_key=' +
              activeKey
              +
              '&redirectUrl=' + window.location.href
              + '&fcmToken=' + sessionStorage.getItem('firebase-messaging-token')
            )
          }
        }
      }}
    />
    <Script
      // strategy='lazyOnload'
      src='https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=CGUHCV3C77U5RBGMKBDG&lib=ttq'
      strategy='afterInteractive'
      onLoad={() => {
        (window as any)?.ttq.page();
      }}
    />
  </>
}

export default Initial
