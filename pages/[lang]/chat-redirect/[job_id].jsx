/* eslint-disable camelcase */
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { isMobile } from 'react-device-detect'
import { useSelector } from 'react-redux'
import { wrapper } from 'store'
import { END } from '@redux-saga/core'

import Layout from 'components/Layout'
import { createChat } from 'app/[lang]/chat/[chat_id]/interpreters/services/chat'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import * as fbq from 'lib/fpixel'

const Chat = () => {
  const router = useRouter()
  const {
    query: { job_id, source }
  } = router
  const userDetail = useSelector((store) => store.users.fetchUserOwnDetail?.response ?? {})
  const userId = userDetail.id
  const userEmail = userDetail.email
  useEffect(() => {
    if (userId) {
      createChat(job_id, { source, device: isMobile ? 'mobile_web' : 'web' })
        .then((result) => {
          const chatId = result.data.data.id
          // Send new chat event to FB Pixel and google analytic
          if (process.env.ENV === 'production' && typeof window !== 'undefined') {
            if (window.gtag) {
              window.gtag('event', 'new_chat', {
                user_id: userId,
                email: userEmail,
                job_id: job_id
              })
            }

            if (window.fbq) {
              fbq.event('new_chat', {
                user_id: userId,
                email: userEmail,
                job_id: job_id
              })
            }

            if (window.ttq) {
              window.ttq.track('SubmitForm', {
                user_id: userId,
                email: userEmail,
                job_id: job_id
              })
            }
          }
          router.push(`/chat/${chatId}`)
        })
        .catch(() => {
          router.push(`/`)
        })
    } else {
      router.push(`/`)
    }
  }, [userId])
  return <Layout loading={true} />
}
export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const accessToken = req.cookies?.accessToken ?? null
  store.dispatch(fetchUserOwnDetailRequest({ accessToken }))
  store.dispatch(END)
  await store.sagaTask.toPromise()
  return {
    props: {}
  }
})
export default Chat
