import React, { useState, useRef, useEffect } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import { TextField } from '@mui/material'
import Modal from 'components/Modal'

const CommonPhrasesEditModal = (props: any) => {
    const { contextRef, loading } = props
    const [show, setShow] = useState(false)
    const actionsRef = useRef<any>()
    const [phrase, setPhrase] = useState({} as any)
    const [text, setText] = useState('')
    useEffect(() => {
        if (phrase) {
            setText(phrase.message)
        }
    }, [phrase])
    const context = {
        showEditOneCommonPhrases(actions) {
            actionsRef.current = actions
            setPhrase(actions.payload)
            setShow(true)
        },
        closeEditOneCommonPhrases() {
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
        handleSecondButton={() => actionsRef.current.save?.({ id: phrase.id, params: { message: text } })}
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
                style={{ width: '100%' }}
                onChange={e => setText(e.target.value)}
                className={styles.textInput}
            />
        </div>
    </Modal>


}
export default CommonPhrasesEditModal
