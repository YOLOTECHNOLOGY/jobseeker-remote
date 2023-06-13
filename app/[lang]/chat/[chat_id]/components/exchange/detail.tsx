/* eslint-disable no-unused-vars */
import Modal from 'components/Modal'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import { getDictionary } from 'get-dictionary'
const ExchangeDetailModal = (props: any) => {
    const { contextRef, loading, lang } = props
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
    const [dic, setDic] = useState<any>({})
    useEffect(() => {
        getDictionary(lang)
            .then(dic => {
                if (dic) {
                    setDic(dic.chatExchange)
                }
            })
    }, [lang])
    contextRef.current = assign(contextRef.current, context)
    const imState = contextRef.current?.getState()
    const rightBtnClick = useCallback(() => {
        actionsRef.current.copy?.()
    }, [actionsRef.current])

    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current?.close?.()}
        headerTitle={dic?.mobileNumber}
        firstButtonText={dic?.close}
        secondButtonText={dic?.copy}
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current?.close?.()}
        handleSecondButton={rightBtnClick}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <div className={styles.modalContainer}>
            <p className={styles.modalTitle}>
                {imState?.recruiter?.full_name ?? dic?.boss}
                {dic?.smb}
                <span style={{ color: '#2378e5' }}>{imState?.contact_exchange_request?.recruiter_contact_num ?? ''}</span>
            </p>
        </div>
    </Modal>
}
export default ExchangeDetailModal