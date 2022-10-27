import React, { useState, useRef } from 'react'
import 'imforbossjob/dist/style.css'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import Modal from 'components/Modal'
import { TextField } from '@mui/material'
const CommonPhrasesCreateModal = (props: any) => {
    const { contextRef, loading } = props

    const [show, setShow] = useState(false)
    const actionsRef = useRef<any>()
    const [text, setText] = useState('')
    const context = {
        showCreateOneCommonPhrases(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeCreateOneCommonPhrases() {
            setShow(false)
        },
    }
    contextRef.current = assign(contextRef.current, context)

    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current?.back?.()}
        headerTitle={'Common Phrases'}
        firstButtonText='Back'
        secondButtonText='Save'
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        isSecondButtonDisabled={!text}
        handleFirstButton={() => actionsRef.current?.back?.()}
        handleSecondButton={() => actionsRef.current.save?.({ params: { message: text } })}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <div className={styles.formContainer}>
            <p>Add your own phrase. Please do not include your contact details here.</p>
            <TextField
                name="phrase_text"
                placeholder="Insert common phrases you have for talents."
                label="phrase"
                value={text}
                style={{width:'100%'}}
                onChange={e => setText(e.target.value)}
                className={styles.textInput}
            />
        </div>
    </Modal>
}
export default CommonPhrasesCreateModal
