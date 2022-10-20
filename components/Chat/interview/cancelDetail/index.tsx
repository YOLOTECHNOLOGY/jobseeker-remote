import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import InterviewDetail from '../interviewDetail'
const CancelDetailModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, data } = props
    const actionsRef = useRef({} as any)
    const context = {
        showCancelDetail(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeCancelDetail() {
            setShow(false)
        }
    }
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={'Interview cancelled'}
        secondButtonText='Done'
        secondButtonIsClose={false}
        handleSecondButton={() => actionsRef.current.close?.()}
    >
        <InterviewDetail data={data} />
    </Modal>
}

export default CancelDetailModal