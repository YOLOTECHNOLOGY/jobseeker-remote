/* eslint-disable react/prop-types */
import { useCallback, useState, useMemo } from 'react';
import Modal from 'components/Modal'
import { chatNowScript, switchJobScript } from '../abstractModels/ChatNow';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import interpreter from 'app/[lang]/interpreters/chatNow'
const ModalSwitch = (props) => {
    const { showModal, setShowModal, requestSwitch, loading, selectedJob, chatData } = props
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
            {chatData?.job?.job_title ?? chatData?.job?.function_job_title ?? 'this job'}{' '}
            position. Are you sure you want to switch job?
        </p>
    </Modal>
}
export const useChatNow = (jobDetail) => {
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [chatData, setChatData] = useState()
    const [modalLoading, setModalLoading] = useState(false)
    const router = useRouter()
    const dispatch = useDispatch()
    const context = useMemo(() => {
        return {
            jobDetail, router, dispatch, showModal: chatData => {
                setChatData(chatData)
                setShowModal(true)
            }
        }
    }, [jobDetail, router, dispatch])
    const requestSwitch = useCallback(() => {
        setModalLoading(true)
        interpreter(switchJobScript(chatData)).run(context).finally(() => {
            setModalLoading(false)
        })
    }, [interpreter, context,chatData])

    const changeJobModal = useMemo(() => {
        return <ModalSwitch
            showModal={showModal}
            setShowModal={setShowModal}
            loading={modalLoading}
            requestSwitch={requestSwitch}
            selectedJob={jobDetail}
            chatData={chatData}
        />
    }, [showModal, setShowModal, modalLoading, jobDetail, requestSwitch])
    const chatNow = useCallback(() => {
        setLoading(true)
        interpreter(chatNowScript())
            .run(context)
            .finally(() => setLoading(false))
    }, [interpreter, context])

    return [loading, chatNow, changeJobModal]
}
export default useChatNow
