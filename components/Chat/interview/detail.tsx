import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import { Button } from '@mui/material'

const DetailModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, data, applicationId } = props
    const actionsRef = useRef({} as any)
    const context = {
        showDetail(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeDetail() {
            setShow(false)
        }
    }
    const cancelReason = 'some reason'
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={'interview invited confirm modal'}
        secondButtonText='Done'
        secondButtonIsClose={false}
        handleSecondButton={() => actionsRef.current.close?.({
            applicationId,
            inviteInterviewId: data.id,
        })}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <Button onClick={() => actionsRef.current?.checkIn?.({
            applicationId,
            inviteInterviewId: data.id
        })}>
            Check In
        </Button>
        <Button onClick={() => actionsRef.current?.cancel?.({
            applicationId,
            inviteInterviewId: data.id,
            params:{
                cancel_reason:cancelReason
            }
        })}>
            Cancel
        </Button>
        <Button onClick={() => actionsRef.current?.reportIssue?.({
            applicationId,
            inviteInterviewId: data.id
        })}>
            Report Issue
        </Button>
        <Button onClick={() => actionsRef.current?.askResult?.({
            applicationId,
            inviteInterviewId: data.id
        })}>
            Ask Result
        </Button>

    </Modal>
}

export default DetailModal