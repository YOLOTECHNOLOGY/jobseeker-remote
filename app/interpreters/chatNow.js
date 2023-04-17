/* eslint-disable react/prop-types */
import { isMobile } from 'react-device-detect'

import { ReaderTPromise as M } from 'app/abstractModels/monads'
import jobSource from 'helpers/jobSource'
import { createChat } from 'helpers/interpreters/services/chat'
import { registInterpreter } from 'app/abstractModels/util'
import { ToChatStatus } from '../abstractModels/ChatNow'
import { getCookie } from 'helpers/cookies'
import { updateImState } from 'store/actions/chat/imState'
import { check } from 'helpers/interpreters/services/chat'
import { fetchSwitchJobService } from 'store/services/jobs/fetchSwitchJob'
import * as fbq from 'lib/fpixel'

const interpreter = registInterpreter((command) =>
  command.cata({
    isLogin: () =>
      M.do(() => {
        const userCookie = getCookie('user')
        const authCookie = getCookie('accessToken')
        return userCookie && authCookie
      }),
    hasChatData: () => M.do((context) => context?.jobDetail?.chat),
    fetchChatData: () =>
      M.do((context) => {
        // const { jobDetail: { recruiter_id } } = context
        const recruiter_id = context?.jobDetail?.recruiter_id || context?.jobDetail?.recruiter?.id
        return check(recruiter_id).then((respones) => respones.data.data?.[0])
      }),
    parseToChatStatus: (chatDetail) =>
      M.do((context) => {
        const { jobDetail } = context
        const userCookie = getCookie('user')
        if (!userCookie.is_profile_completed) {
          return ToChatStatus.notCompleteFile
        }
        const { external_apply_url, id } = jobDetail
        if (external_apply_url) {
          return ToChatStatus.externalLink(external_apply_url)
        } else if (chatDetail.is_exists && id === chatDetail.job_id) {
          return ToChatStatus.existSameJob
        } else if (chatDetail.is_exists && id !== chatDetail.job_id) {
          return ToChatStatus.existDiffrentJob
        } else {
          return ToChatStatus.notExist
        }
      }),
    redirectToLogin: () =>
      M.do((context) => {
        const { jobDetail, router } = context
        const { id } = jobDetail
        const source = jobSource()
        localStorage.setItem('isChatRedirect', `/chat-redirect/${id}?source=${source}`)
        router.push('/get-started', { forceOptimisticNavigation: true })
      }),
    redirectToExternal: (link) =>
      M.do((context) => {
        const { router } = context
        router.push(link, { forceOptimisticNavigation: true })
      }),
    modalChangeChattingJob: (chatDetail) =>
      M.do((context) => {
        const { showModal } = context
        showModal(chatDetail)
      }),
    requestChangeJob: (chatDetail) =>
      M.do((context) => {
        const { jobDetail } = context
        const { id } = jobDetail
        return fetchSwitchJobService({
          status: 'protected',
          job_id: id,
          applicationId: chatDetail.job_application_id
        }).then(() => chatDetail.id || chatDetail.chat_id)
      }),
    redirectToChat: (chatId) =>
      M.do((context) => {
        const { router } = context
        router.push('/chat/' + chatId, { forceOptimisticNavigation: true })
      }),
    redirectToCompleteFile: () =>
      M.do((context) => {
        const { jobDetail, router } = context
        const { id } = jobDetail
        const source = jobSource()
        localStorage.setItem('isChatRedirect', `/chat-redirect/${id}?source=${source}`)
        router.push('/jobseeker-complete-profile/1')
      }),
    createNewChat: () =>
      M.do((context) => {
        const { jobDetail, dispatch } = context
        const { id } = jobDetail
        const source = jobSource()
        return createChat(id, { source, job_title_id: id, device: isMobile ? 'mobile_web' : 'web' })
          .then((result) => {
            const chatId = result.data.data.id
            const newData = {
              ...result.data?.data?.job_application,
              initiated_role: result.data?.data?.initiated_role,
              chatStatus: result.data?.data?.status
            }
            dispatch(updateImState({ chatId, imState: newData }))
            const userInfo = getCookie('user')
            // Send new chat event to FB Pixel and google analytic
            if (
              // process.env.ENV === 'production' &&
              typeof window !== 'undefined' &&
              userInfo && jobDetail && !jobDetail.chat?.is_exists
            ) {
              if (window.gtag) {
                window.gtag('event', 'new_chat', {
                  user_id: userInfo.id,
                  email: userInfo.email,
                  job_id: jobDetail.id
                })
              }

              if (window.fbq) {
                fbq.event('new_chat', {
                  user_id: userInfo.id,
                  email: userInfo.email,
                  job_id: jobDetail.id
                })
              }

              if (window.ttq) {
                window.ttq.track('SubmitForm', {
                  user_id: userInfo.id,
                  email: userInfo.email,
                  job_id: jobDetail.id
                });
              }
            }
            return chatId
          })
      })
  })
)

export default interpreter
