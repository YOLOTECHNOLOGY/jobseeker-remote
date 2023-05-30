'use client'

import { Button } from '@mui/material'
import configuredAxios from 'helpers/configuredAxios'
import { getCookie, removeUserCookie, setCookie, accessToken } from 'helpers/cookies'
import router from 'next/router'
import Loading from './[lang]/loading'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: any; reset: () => void }) {
  useEffect(() => {
    function redirectToGetStarted() {
      removeUserCookie()
      window.location.href = '/get-started'
    }

    if (
      error?.message?.includes('status code 401') ||
      error.digest === '193452068' ||
      error.digest === '2228123006'
    ) {
      if (globalThis.globalPromise) {
        globalThis.globalPromise.then(() => {
          window.location.reload()
        })
      } else {
        const axios = configuredAxios('auth', '', '', '')
        const refresh = getCookie('refreshToken')
        const data = { source: 'web', refresh }

        if (!refresh) {
          setTimeout(() => {
            redirectToGetStarted()
          }, 3000)
          // redirect to login after 3s, so
        }
        globalThis.globalPromise = axios
          .post('/token/refresh', data)
          .then((res: any) => {
            const { access, token_expired_at } = res?.data?.data ?? {}
            if (access) {
              setCookie(accessToken, access, token_expired_at)
              setTimeout(
                () => {
                  // window.location.reload()
                  redirectToGetStarted()
                },
                // display the error longer, we can check it clearly
                process.env.ENV !== 'production' ? 1000 : 0
              )
            } else {
              // refresh token errored, in this case, that means the refreshToken is expired
              // so we should leave and login
              redirectToGetStarted()
            }
          })
          .catch((e) => {
            redirectToGetStarted()
          })
      }
    } else {
      redirectToGetStarted()
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
          <div style={{ marginTop: 100 }}>
            <Loading />
          </div>
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
