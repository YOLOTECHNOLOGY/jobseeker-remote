import React, { useState, useRef } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import Modal from 'components/Modal'
import { TextField } from '@mui/material'
const CommonPhrasesCreateModal = (props: any) => {
  const { contextRef, loading,dic } = props

  const [show, setShow] = useState(false)
  const actionsRef = useRef<any>()
  const [text, setText] = useState('')

  const context = {
    showCreateOneCommonPhrases(actions) {
      actionsRef.current = actions
      setShow(true)
    },
    closeCreateOneCommonPhrases() {
      setText('')
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
      handleSecondButton={() => actionsRef.current.save?.({ params: { message: text } })}
      isSecondButtonLoading={loading}
      isFirstButtonLoading={loading}
    >
      <div className={styles.formContainer}>
        <p>{dic?.addDescription}</p>
        <TextField
          name='phrase_text'
          placeholder={dic?.inputPlaceholder}
          label={dic?.phraseLabel}
          value={text}
          style={{ width: '100%' }}
          autoFocus
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
export default CommonPhrasesCreateModal
