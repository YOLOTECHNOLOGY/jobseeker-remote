import React, { useState, useRef } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import Modal from 'components/Modal'
const CommonPhrasesDeleteModal = (props: any) => {
    const { contextRef, loading } = props
    const [show, setShow] = useState(false)
    const [phrase, setPhrase] = useState<any>({})
    const actionsRef = useRef<any>()
    const context = {
        showDeleteOneCommonPhrases(actions) {
            actionsRef.current = actions
            setShow(true)
            setPhrase(actions.payload)
        },
        closeDeleteOneCommonPhrases() {
            setShow(false)
        },
    }
    contextRef.current = assign(contextRef.current, context)

    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.back?.()}
        headerTitle={'Common Phrases'}
        firstButtonText='Back'
        secondButtonText='Delete'
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current?.back?.()}
        handleSecondButton={() => actionsRef.current.delete?.({ id: phrase.id, params: { message: phrase.message } })}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}>
        <div className={styles.modalContainer}>
            <p className={styles.modalTitle}>Common Phrases</p>
            <div className={styles.formContainer}>
                <p>Sure to delte this?</p>
                <h5>{phrase.message}</h5>
            </div>
        </div>
    </Modal>
}

export default CommonPhrasesDeleteModal
