'use client'
import { useFirstRender } from 'helpers/useFirstRender'
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation';
import { initFireBase } from 'helpers/fireBaseManager'
import Script from 'next/script'
import * as fbq from 'lib/fpixel'
import * as gtag from 'lib/gtag'

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
// const win = globalThis as any
// (globalThis as any).gtag_report_conversion = (url) => {
//   const callback = function () {
//     if (typeof(url) != 'undefined') {
//       win.location = url;
//     }
//   };
//   win.gtag('event', 'conversion', {
//       'send_to': 'AW-844310282/-rRMCKjts6sBEIrOzJID',
//       'event_callback': callback
//   });
//   return false;
// }
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

window.onhashchange = e => {
  console.log('windowChange', e)
}
const Initial = () => {
  const firstRender = useFirstRender()
  const searchParams = useSearchParams()

  const gtmID = process.env.ENV === 'production' ? 'GTM-KSGSQDR' : 'GTM-PR4Z29C'

  useEffect(() => {
    if (firstRender) {
      runInClient(searchParams)
    }
  }, [firstRender])
  // const [gtagReady, setGtagReady] = useState(false)
  useEffect(() => {
    // Facebook pixel
    // This pageview only triggers the first time
    // if (gtagReady) {
    gtag.pageview(location.pathname)
    // }
    fbq.pageview()
  }, [])
  return <>
    {/* <Script
      strategy='lazyOnload'
      onLoad={() => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        // eslint-disable-next-line prefer-rest-params
        function gtag(...args) { ((window as any)).dataLayer.push(args); }
        gtag('js', new Date());
        gtag('config', gtag.GA_TRACKING_ID, {
          page_path: window.location.pathname,
        });
        (window as any).gtag = gtag
        setGtagReady(true)

      }}
      src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      id='gtag-init'
      dangerouslySetInnerHTML={{
        __html: `
            
          `
      }}
    /> */}
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

    {/* Google Tag Manager (gtm)  https://tagmanager.google.com */}
    <Script
      dangerouslySetInnerHTML={{
        __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer', ${gtmID})
        `
      }}
    />
      
    {/* Facebook  */}
    <Script
      dangerouslySetInnerHTML={{
        __html: `
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
            `
      }}
    />
    <Script
      strategy='lazyOnload'
      // dangerouslySetInnerHTML={{
      //   __html: `
      //     !function (w, d, t) {
      //       w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++
      // )ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=i+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

      //       ttq.load('CGUHCV3C77U5RBGMKBDG');
      //       ttq.page();
      //     }(window, document, 'ttq');
      //     `
      // }}
      src='https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=CGUHCV3C77U5RBGMKBDG&lib=ttq'
      onLoad={() => {
        (window as any)?.ttq.page();
      }}
    />

  </>
}

export default Initial
