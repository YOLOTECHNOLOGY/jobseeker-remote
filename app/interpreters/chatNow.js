/* eslint-disable react/prop-types */
import { ReaderTPromise as M } from 'app/abstractModels/monads'
import jobSource from 'helpers/jobSource'
import { createChat } from 'helpers/interpreters/services/chat'
import { registInterpreter } from 'app/abstractModels/util';
import { ToChatStatus } from '../abstractModels/ChatNow';
import { getCookie } from 'helpers/cookies';
import { updateImState } from 'store/actions/chat/imState';
import { check } from 'helpers/interpreters/services/chat'
import { fetchSwitchJobService } from 'store/services/jobs/fetchSwitchJob';
const interpreter = registInterpreter(command => command.cata({
    isLogin: () => M.do(() => {
        const userCookie = getCookie('user')
        const authCookie = getCookie('accessToken')
        return userCookie && authCookie
    }),
    hasChatData: () => M.do(context => context?.jobDetail?.chat),
    fetchChatData: () => M.do(context => {
        // const { jobDetail: { recruiter_id } } = context
        const recruiter_id = context?.jobDetail?.recruiter_id || context?.jobDetail?.recruiter?.id
        return check(recruiter_id).then(respones => respones.data.data?.[0])
    }),
    parseToChatStatus: chatDetail => M.do(context => {
        const { jobDetail } = context

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
    redirectToLogin: () => M.do(context => {
        const { jobDetail, router } = context
        const { id } = jobDetail
        const source = jobSource()
        localStorage.setItem('isChatRedirect', `/chat-redirect/${id}?source=${source}`)
        router.push('/get-started', { forceOptimisticNavigation: true })
    }),
    redirectToExternal: link => M.do(context => {
        const { router } = context
        router.push(link, { forceOptimisticNavigation: true })
    }),
    modalChangeChattingJob: chatDetail => M.do(context => {
        const { showModal } = context
        showModal(chatDetail)
    }),
    requestChangeJob: chatDetail => M.do(context => {
        const { jobDetail } = context
        const { id } = jobDetail
        return fetchSwitchJobService({
            status: 'protected',
            job_id: id,
            applicationId: chatDetail.job_application_id
        }).then(() => chatDetail.id || chatDetail.chat_id)

    }),
    redirectToChat: chatId => M.do(context => {
        const { router } = context
        router.push('/chat/' + chatId, { forceOptimisticNavigation: true })
    }),
    createNewChat: () => M.do(context => {
        const { jobDetail, dispatch } = context
        const { id } = jobDetail
        const source = jobSource()
        return createChat(id, { source })
            .then((result) => {
                const chatId = result.data.data.id
                const newData = {
                    ...result.data?.data?.job_application,
                    initiated_role: result.data?.data?.initiated_role,
                    chatStatus: result.data?.data?.status
                }
                dispatch(updateImState({ chatId, imState: newData }))
                return chatId
            })
    })
}))


export default interpreter
