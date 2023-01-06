/* eslint-disable no-unused-vars */
import Modal from 'components/Modal'
import React, { useCallback, useRef, useState } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
const ExchangeDetailModal = (props: any) => {
    const { contextRef, loading } = props
    const [show, setShow] = useState(false)
    const actionsRef = useRef<any>()
    const context = {
        showExchangeDetail(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeExchangeDetail() {
            setShow(false)
        }
    }
    contextRef.current = assign(contextRef.current, context)
    const imState = contextRef.current?.getState()
    const rightBtnClick = useCallback(() => {
        actionsRef.current.copy?.()
    }, [actionsRef.current])

    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current?.close?.()}
        headerTitle={'Mobile number'}
        firstButtonText='Close'
        secondButtonText={'Copy'}
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current?.close?.()}
        handleSecondButton={rightBtnClick}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <div className={styles.modalContainer}>
            <p className={styles.modalTitle}>
                {imState?.jobseeker?.full_name ?? 'Boss'}
                {'\'s mobile number:'}
                <span style={{ color: '#2378e5' }}>{imState?.contact_exchange_request?.recruiter_contact_num ?? ''}</span>
            </p>
        </div>
    </Modal>
}
export default ExchangeDetailModal