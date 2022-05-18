import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AppProps } from 'next/app'
import { wrapper } from 'store'
import { getCookie, removeCookie } from 'helpers/cookies'
import { CookiesProvider } from 'react-cookie'
import { ConnectedRouter } from 'connected-next-router'

import 'styles/globals.scss'
import Script from 'next/script'
import * as gtag from 'lib/gtag'
import MaintenancePage from './maintenance'

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

  // Validate token on every page navigation
  useEffect(() => {
    const accessToken = getCookie('accessToken')

    if (accessToken) {
      fetch(`${process.env.AUTH_BOSSJOB_URL}/token/validate`, {
        method: 'POST',
        headers: new Headers({
          'Authorization': 'Bearer ' + getCookie('accessToken'), 
        }), 
      })
        .then((resp) => {
          if (resp.status !== 200) {
            removeCookie('user')
            removeCookie('accessToken')
            removeCookie('splan')

            router.push('/login/jobseeker')
          }
        })
    }
  }, [router])

  return (
    <>
      {/* Google AdSense */}
      {/* <Script
        data-ad-client='ca-pub-4245733463545444'
        async
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      ></Script> */}
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
      {/* <Script async src='https://securepubads.g.doubleclick.net/tag/js/gpt.js'></Script>
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            window.googletag = window.googletag || {cmd: []}
          `,
        }}
      ></Script> */}

      {/* Google One Tap Sign in */}
      <Script src="https://apis.google.com/js/platform.js"/>
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
              window.location.replace("/handlers/googleLoginHandler?access_token=" + accessToken + "&active_key=" + activeKey);
            }
          `
        }}
      />

      {/* Facebook */}
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            function initialize() {	
              FB.init({	
                appId            : ${ process.env.CUSTOM_NODE_ENV === 'production' ? '2026042927653653' : '2111002932479859'},
                autoLogAppEvents : true,	
                xfbml            : true,	
                version          : 'v6.0'	
              });	

              FB.Event.subscribe('messenger_checkbox', function(e) {
                console.log("messenger_checkbox event");
                console.log(e);
                if (e.event == 'rendered') {
                  console.log("Plugin was rendered");
                } else if (e.event == 'checkbox') {
                  var checkboxState = e.state;
                  console.log("Checkbox state: " + checkboxState);
                } else if (e.event == 'not_you') {
                  console.log("User clicked 'not you'");
                } else if (e.event == 'hidden') {
                  console.log("Plugin was hidden");
                }
              });
            };	
            if(window.FB === undefined) {	
              window.fbAsyncInit = function() {	
                initialize();	
              };	
            }	
            else {	
              initialize();	
            }	

            (function(d, s, id){	
              var js, fjs = d.getElementsByTagName(s)[0];	
              if (d.getElementById(id)) {return;}	
              js = d.createElement(s); js.id = id;	
              js.src = "https://connect.facebook.net/en_US/sdk.js";	
              fjs.parentNode.insertBefore(js, fjs);	
            }(document, 'script', 'facebook-jssdk'));	
            `
        }}
      />

      <ConnectedRouter>
        <CookiesProvider>
          {process.env.MAINTENANCE === 'true' ? <MaintenancePage {...pageProps} /> : <Component {...pageProps} />}
        </CookiesProvider>
      </ConnectedRouter>
    </>
  )
}

export default wrapper.withRedux(App)
