'use client'
import { getCookie } from 'helpers/cookies'
import { useRouter } from 'next/navigation'
import { useState, useCallback, useTransition } from 'react'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { fetchJobsForYouDelete } from 'store/services/jobs/fetchJobsForYouLogin'

const useNotSuitable = (preferenceId, jobId) => {
    const accessToken = getCookie('accessToken')
    const dispatch = useDispatch()
    const [showSelectionModal, setShowSelectionModal] = useState(false)
    const [showTextModal, setShowTextModal] = useState(false)
    const router = useRouter()
    const [loading, startTransition] = useTransition()
    const showSelection = useCallback(() => {
        setShowSelectionModal(true)
    }, [])
    const hideSelection = useCallback(() => {
        setShowSelectionModal(false)
    }, [])
    const request = useCallback(reason => {
        return fetchJobsForYouDelete({ job_preference_id: preferenceId, job_id: jobId, reason }, accessToken)
            .then(dispatch(
                displayNotification({
                    open: true,
                    message: 'We will optimise your job recommendation.',
                    severity: 'success'
                })
            )).then(() => {
                setShowSelectionModal(false)
                setShowTextModal(false)
                startTransition(() => {
                    router.refresh()
                })
            })
    }, [jobId, router])
    const showText = useCallback(() => {
        setShowSelectionModal(false)
        setShowTextModal(true)
    }, [])
    const hideText = useCallback(() => {
        setShowTextModal(false)
    })

    return {
        showSelection,
        hideSelection,
        showText,
        hideText,
        request,
        showSelectionModal,
        showTextModal,
        refreshing: loading
    }
}

export default useNotSuitable