/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isMobile } from 'react-device-detect'
import Loading from './loading'
import { createChat } from 'app/[lang]/chat/[chat_id]/interpreters/services/chat'
import * as fbq from 'lib/fpixel'

const Chat = props => {
  const router = useRouter()
  const {
    params: { job_id },
    searchParams: { source },
    userDetail
  } = props
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
  return <Loading />
}

export default Chat
