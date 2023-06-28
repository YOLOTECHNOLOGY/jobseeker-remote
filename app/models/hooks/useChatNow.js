/* eslint-disable react/prop-types */
import { useCallback, useState, useMemo, useContext, useEffect, useRef } from 'react';
import Modal from 'components/Modal'
import { chatNowScript, switchJobScript } from '../abstractModels/ChatNow';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import interpreter from 'app/models/interpreters/chatNow'
import { formatTemplateString } from 'helpers/formatter';
import { languageContext } from '../../components/providers/languageProvider';
import { fetchJobDetailService } from 'store/services/jobs/fetchJobDetail';
import { LoginModalContext } from '../../components/providers/loginModalProvider';

const ModalSwitch = (props) => {
    const { showModal, setShowModal, requestSwitch, loading, existedJob, selectedJob } = props
    const { jobDetail: translation } = useContext(languageContext)
    const { switchModal } = translation || {}
    return <Modal
        showModal={showModal}
        handleModal={() => setShowModal(false)}
        firstButtonIsClose={false}
        handleFirstButton={() => setShowModal(false)}
        handleSecondButton={requestSwitch}
        isFirstButtonLoading={loading}
        isSecondButtonLoading={loading}
        firstButtonText={switchModal.btn1}
        secondButtonText={switchModal.btn2}
        headerTitle={formatTemplateString(switchModal.title, selectedJob?.recruiter?.full_name ?? '')}
    >
        <p>
            {formatTemplateString(switchModal.content, existedJob.job_title ?? 'this job')}
        </p>
    </Modal >
}
const ModalCompleteFile = (props) => {
    const { showModal, setShowModal, handler } = props
    const [loading, setLoading] = useState(false)
    const { jobDetail: translation } = useContext(languageContext)
    const { completeProfileModal } = translation || {}
    return <Modal
        showModal={showModal}
        handleModal={() => setShowModal(false)}
        firstButtonIsClose={false}
        handleFirstButton={() => setShowModal(false)}
        handleSecondButton={() => {
            setLoading(true)
            handler?.()
        }}
        firstButtonText={completeProfileModal.btn1}
        secondButtonText={completeProfileModal.btn2}
        headerTitle={completeProfileModal.title}
        isFirstButtonLoading={loading}
        isSecondButtonLoading={loading}
    >
        <p>
            {completeProfileModal.content}
        </p>
    </Modal >
}
export const useChatNow = (jobDetail) => {
    const { setShowLogin } = useContext(LoginModalContext)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [chatData, setChatData] = useState()
    const [modalLoading, setModalLoading] = useState(false)
    const [showComplete, setShowComplete] = useState(false)
    const handleCompleteRef = useRef()
    const [existedJob, setExistedJob] = useState({})
    const router = useRouter()
    const dispatch = useDispatch()
    const showCompleteModal = useCallback(handler => {
        handleCompleteRef.current = handler
        setShowComplete(true)
    }, [])
    const context = useMemo(() => {
        return {
            jobDetail, router, dispatch, showModal: chatData => {
                setChatData(chatData)
                setShowModal(true)
            },
            showCompleteModal,
            showLogin: () => setShowLogin?.(true),
        }
    }, [jobDetail, router, dispatch, showCompleteModal])
    const requestSwitch = useCallback(() => {
        setModalLoading(true)
        interpreter(switchJobScript(chatData)).run(context).finally(() => {
            setModalLoading(false)
        })
    }, [interpreter, context, chatData])

    useEffect(() => {
        const jobId = jobDetail?.chat?.job_id
        if (jobId && jobId !== jobDetail.id) {
            fetchJobDetailService({ jobId }).then((data) => {
                setExistedJob(data?.data?.data)
            })
        }
    }, [jobDetail?.id])
    const changeJobModal = useMemo(() => {
        return <>
            <ModalCompleteFile
                showModal={showComplete}
                setShowModal={setShowComplete}
                handler={() => handleCompleteRef.current?.()}
            />
            <ModalSwitch
                existedJob={existedJob}
                showModal={showModal}
                setShowModal={setShowModal}
                loading={modalLoading}
                requestSwitch={requestSwitch}
                selectedJob={jobDetail}
                chatData={chatData}
            /></>
    }, [showModal, setShowModal, modalLoading, jobDetail, requestSwitch, showComplete, setShowComplete])
    const chatNow = useCallback(() => {
        setLoading(true)
        return interpreter(chatNowScript())
            .run(context)
            .finally(() => setLoading(false))
    }, [interpreter, context])

    return [loading, chatNow, changeJobModal]
}
export default useChatNow
