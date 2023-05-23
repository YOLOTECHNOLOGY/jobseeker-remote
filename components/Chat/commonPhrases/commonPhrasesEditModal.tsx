import React, { useState, useRef, useEffect } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import { TextField } from '@mui/material'
import Modal from 'components/Modal'

const CommonPhrasesEditModal = (props: any) => {
  const { contextRef, loading, dic } = props
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
    }
  }
  contextRef.current = assign(contextRef.current, context)

  return (
    <Modal
      showModal={show}
      handleModal={() => actionsRef.current?.back?.()}
      headerTitle={dic?.phraseTitle}
      firstButtonText={dic?.back}
      secondButtonText={dic?.save}
      firstButtonIsClose={false}
      secondButtonIsClose={false}
      isSecondButtonDisabled={!text}
      handleFirstButton={() => actionsRef.current?.back?.()}
      handleSecondButton={() =>
        actionsRef.current.save?.({ id: phrase.id, params: { message: text } })
      }
      isSecondButtonLoading={loading}
      isFirstButtonLoading={loading}
    >
      <div className={styles.formContainer}>
        <p>{dic.addDescription}</p>
        <TextField
          name='phrase_text'
          placeholder={dic?.inputPlaceholder}
          label={dic?.phraseLabel}
          value={text}
          autoFocus
          style={{ width: '100%' }}
          onChange={(e) => {
            const { value } = e.target
            if (value.length < 500) {
              setText(value)
            }
          }}
          className={styles.textInput}
        />
      </div>
    </Modal>
  )
}
export default CommonPhrasesEditModal
