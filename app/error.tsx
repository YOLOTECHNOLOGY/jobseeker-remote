'use client'

import { Button } from '@mui/material'
import configuredAxios from 'helpers/configuredAxios'
import { getCookie, removeUserCookie, setCookie, accessToken } from 'helpers/cookies'
import router from 'next/router'
import { useEffect } from 'react'
import logError from './errors/logError'
function redirectToGetStarted() {
  removeUserCookie()
  window.location.href = '/get-started'
}

export default function GlobalError({ error, reset }: { error: any; reset: () => void }) {
  useEffect(() => {

    if (error.digest === '193452068') {
      if (globalThis.globalPromise) {
        globalThis.globalPromise.then(() => {
          window.location.reload()
        })
      } else {
        const axios = configuredAxios('auth', '', '', '')
        const refresh = getCookie('refreshToken')
        const data = { source: 'web', refresh }

        if (!refresh) {
          redirectToGetStarted()
        }
        globalThis.globalPromise = axios
          .post('/token/refresh', data)
          .then((res: any) => {
            const { access, token_expired_at } = res?.data?.data ?? {}
            if (access) {
              setCookie(accessToken, access, token_expired_at)
              redirectToGetStarted()
            } else {
              // refresh token errored, in this case, that means the refreshToken is expired
              // so we should leave and login
              logError({ name: 'refresh token failed', data: res?.data?.data })
              redirectToGetStarted()
            }
          })
          .catch((e) => {
            logError({ name: 'refresh token error', error: e })
            redirectToGetStarted()
          })
      }
    } else {
      logError(error)
    }
  }, [])
  return (
    <html>
      <head></head>
      <body
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}
      >
        <div id='root'>
          <h2>Something went wrong!</h2>

          <div>
            <Button
              variant='outlined'
              onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
              }
              sx={{
                textTransform: 'capitalize',
                marginRight: '15px'
              }}
            >
              Try again
            </Button>
            <Button
              variant='contained'
              onClick={() => router.push('/')}
              sx={{
                textTransform: 'capitalize'
              }}
            >
              Go Home
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
