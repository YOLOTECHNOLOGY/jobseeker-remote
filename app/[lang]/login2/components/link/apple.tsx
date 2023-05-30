import React, { useEffect, useState } from 'react'
import styles from '../../index.module.scss'

import { AppleIcon } from 'images'

export default function AppleLogin() {
  const [appleAuth, setAppleAuth] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // setAppleAuth(null)
      const handleClientLoad = () => {
        window.AppleID.auth.init({
            clientId : 'com.poseidon.bossjobapp.client',
            scope : 'name email',
            redirectURI : 'https://dev.bossjob.ph/',
            state : '',
            nonce : '',
            usePopup : true
        });
      }

       const script = document.createElement('script')

       script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'
       script.async = true
       script.defer = true
       script.onload = handleClientLoad

       document.body.appendChild(script)

       return () => {
         document.body.removeChild(script)
       }
    }
  }, [])


  const handleAuth = async () => {
    try {
      const data = await window.AppleID.auth.signIn()
            // Handle successful response.
            console.log('success', data)
      } catch ( error ) {
            // Handle error.
            console.log('error', error)
      }
  }

  useEffect(() => {
    if(typeof window != 'undefined') {
      // Listen for authorization success.
      document.addEventListener('AppleIDSignInOnSuccess', (event: any) => {
        // Handle successful response.
        console.log('success: ',event.detail.data);
      });

      // Listen for authorization failures.
      document.addEventListener('AppleIDSignInOnFailure', (event: any) => {
        // Handle error.
        console.log('error: ',event.detail.error);
      });
    }
  }, [])

  return (
    <div className={styles.login_item}>
        <img src={AppleIcon}></img>
        {/* <div id="appleid-signin" data-color="black" data-border="true" data-type="sign in"></div> */}
        <span data-type="sign in" onClick={handleAuth}>Continue with Apple</span>
    </div>
  )
}
