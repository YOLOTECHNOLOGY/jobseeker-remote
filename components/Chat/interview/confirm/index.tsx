import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import { formatTemplateString } from 'helpers/formatter'
const ConfirmModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, data, applicationId, dic } = props
    const actionsRef = useRef({} as any)
    const context = {
        showConfirm(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeConfirm() {
            setShow(false)
        }
    }
    contextRef.current = assign(contextRef.current, context)
    const imState = contextRef.current?.getState()

    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={formatTemplateString(dic.title, imState?.company?.name ?? 'company')}
        firstButtonText={dic.back}
        secondButtonText={dic.accept}
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current.back?.()}
        handleSecondButton={() => actionsRef.current.accept?.({
            applicationId,
            inviteInterviewId: data.id,
        })}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <p className={styles.mainText}>{dic.confirmText1}</p>
        <p className={styles.subText}>{dic.contirmText2}</p>
    </Modal>
}

export default ConfirmModal