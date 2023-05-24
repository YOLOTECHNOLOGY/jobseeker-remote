/* eslint-disable no-unused-vars */
import Modal from 'components/Modal'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import { getDictionary } from 'get-dictionary'
const ExchangeConfirmModal = (props: any) => {
    const { contextRef, loading, applicationId,lang } = props
    const [dic, setDic] = useState<any>({})
    useEffect(() => {
        getDictionary(lang)
            .then(dic => {
                if (dic) {
                    setDic(dic.chatExchange)
                }
            })
    }, [lang])
    const [show, setShow] = useState(false)
    const actionsRef = useRef<any>()
    const context = {
        showExchangeConfirm(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeExchangeConfirm() {
            setShow(false)
        }
    }
    contextRef.current = assign(contextRef.current, context)
    const rightBtnClick = useCallback(() => {
        actionsRef.current.sendNumber?.({ applicationId })
    }, [applicationId])

    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current?.close?.()}
        headerTitle={dic?.exchangeTitle}
        firstButtonText={dic?.cancel}
        secondButtonText={dic?.send}
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current?.close?.()}
        handleSecondButton={rightBtnClick}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <div className={styles.modalContainer}>
            <p className={styles.modalTitle}>Are you sure you want to exchange mobile number with Boss? You will be able to view Boss’s mobile number after Boss had agreed to your request.</p>
        </div>
    </Modal>
}
export default ExchangeConfirmModal