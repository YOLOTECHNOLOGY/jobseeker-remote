/* eslint-disable react/prop-types */
import { useCallback, useState, useMemo } from 'react';
import { ReaderTPromise as M } from 'app/abstractModels/monads'
import jobSource from 'helpers/jobSource'
import Modal from 'components/Modal'
import { createChat } from 'helpers/interpreters/services/chat'
import { registInterpreter } from 'app/abstractModels/util';
import { chatNowScript, ToChatStatus } from '../abstractModels/ChatNow';
import { useRouter } from 'next/navigation';
import { getCookie } from 'helpers/cookies';
import { useDispatch } from 'react-redux';
import { updateImState } from 'store/actions/chat/imState';
// export const ToChatStatus = taggedSum('ChatStatus', {
//     notLogin: [],
//     externalLink: ['link'],
//     existSameJob: [''],
//     existDiffrentJob: [''],
//     notExist: ['']
// })
// export const Actions = taggedSum('ChatNowActions', {
//     parseToChatStatus: [],
//     redirectToLogin: [],
//     redirectToExternal: ['link'],
//     modalChangeChattingJob: [],
//     redirectToChat: ['chatId'],
//     requestChangeJob: [],
//     createNewChat: []
// })

const ModalSwitch = (props) => {
    const { showModal, setShowModal, requestSwitch, loading, selectedJob } = props
    return <Modal
        showModal={showModal}
        handleModal={() => setShowModal(false)}
        firstButtonIsClose={false}
        handleFirstButton={() => setShowModal(false)}
        handleSecondButton={requestSwitch}
        isFirstButtonLoading={loading}
        isSecondButtonLoading={loading}
        firstButtonText='Cancel'
        secondButtonText='Proceed'
        headerTitle={'Chat with ' + selectedJob?.recruiter?.full_name ?? ''}
    >
        <p>
            You are currently chatting with recruiter for the{' '}
            {selectedJob?.chat?.job?.job_title ?? selectedJob?.chat?.job?.function_job_title ?? 'this job'}{' '}
            position. Are you sure you want to switch job?
        </p>
    </Modal>
}
export const useChatNow = (jobDetail) => {
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()
    const chatDetail = jobDetail.chat
    const requestSwitch = useCallback(() => {
        setLoading(true)
        fetchSwitchJobService({
            status: 'protected',
            job_id: jobDetail.id,
            applicationId: chatDetail.job_application_id
        })
            .then(() => {
                router.push(`/chat/${chatDetail.chat_id}`)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [jobDetail.id, chatDetail?.job_application_id, chatDetail?.chat_id])
    const modalChange = useMemo(() => {
        return <ModalSwitch
            showModal={showModal}
            setShowModal={setShowModal}
            loading={loading}
            requestSwitch={requestSwitch}
            selectedJob={jobDetail}
        />
    }, [showModal, setShowModal, loading, jobDetail, requestSwitch])
    const dispatch = useDispatch()
    const interpreter = useCallback(registInterpreter(command => command.cata({
        parseToChatStatus: () => M.do(context => {
            const { external_apply_url, is_exists, id, chat: chatDetail } = context
            const userCookie = getCookie('user')
            const authCookie = getCookie('accessToken')
            if (!userCookie || !authCookie) {
                return ToChatStatus.notLogin
            } else if (external_apply_url) {
                return ToChatStatus.externalLink(external_apply_url)
            } else if (is_exists && id === chatDetail.job_id) {
                return ToChatStatus.existSameJob
            } else if (is_exists && id !== chatDetail.job_id) {
                return ToChatStatus.existDiffrentJob
            } else {
                return ToChatStatus.notExist
            }
        }),
        redirectToLogin: () => M.do(context => {
            const { id } = context
            const source = jobSource()
            localStorage.setItem('isChatRedirect', `/chat-redirect/${id}?source=${source}`)
            router.push('/get-started')
        }),
        redirectToExternal: link => M.do(() => {
            router.push(link)
        }),
        modalChangeChattingJob: () => M.do(() => {
            setShowModal(true)
        }),
        requestChangeJob: () => M.do(() => {
            return requestSwitch()
        }),
        redirectToChat: chatId => M.do(() => {
            router.push('/chat/' + chatId)
        }),
        createNewChat: () => M.do(context => {
            const { id } = context
            const source = jobSource()
            setLoading(true)
            return createChat(id, { source })
                .then((result) => {
                    console.log({ result })
                    const chatId = result.data.data.id
                    const newData = {
                        ...result.data?.data?.job_application,
                        initiated_role: result.data?.data?.initiated_role,
                        chatStatus: result.data?.data?.status
                    }
                    dispatch(updateImState({ chatId, imState: newData }))
                    // router.push(`/chat/${chatId}`)
                    return chatId
                })
                // .catch(() => {
                //     router.push(`/chat`)
                // })
                .finally(() => setLoading(false))
        })
    })), [router])

    const chatNow = useCallback(() => {
        interpreter(chatNowScript()).run(jobDetail)
    }, [interpreter, jobDetail])

    return [loading, chatNow, modalChange]
}
export default useChatNow
// const handleChat = () => {
//     if (!userCookie || !authCookie) {
//       const source = jobSource()
//       localStorage.setItem('isChatRedirect', `/chat-redirect/${selectedJob.id}?source=${source}`)
//       setOpenRegister(true)
//     } else if (selectedJob?.external_apply_url) {
//       addExternalJobClickService(selectedJob?.id)
//       const link = getApplyJobLink(selectedJob, userCookie)
//       window.open(link)
//     } else if (chatDetail.is_exists) {
//       if (chatDetail.job_id !== selectedJobId) {
//         setShowModal(true)
//       } else {
//         router.push(`/chat/${chatDetail.chat_id}`)
//       }
//     } else {
//       setLoading(true)
//       const source = jobSource()
//       createChat(selectedJob?.id, { source })
//         .then((result) => {
//           const chatId = result.data.data.id
//           const newData = {
//             ...result.data?.data?.job_application,
//             initiated_role: result.data?.data?.initiated_role,
//             chatStatus: result.data?.data?.status
//           }
//           dispatch(updateImState({ chatId, imState: newData }))
//           router.push(`/chat/${chatId}`)
//         })
//         .catch(() => {
//           router.push(`/chat`)
//         })
//         .finally(() => setLoading(false))
//     }
//   }