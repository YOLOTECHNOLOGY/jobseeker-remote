import React, { useState, useRef, useCallback } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import ContentLoader from 'react-content-loader'
import Modal from 'components/Modal'
const CommonPhrasesModal = (props: any) => {
  const { contextRef, loading, listLoading, list,dic } = props
  const [show, setShow] = useState(false)
  const [selected, setSelected] = useState({} as any)
  const actionsRef = useRef<any>()
  const context = {
    showCommonPhrases(actions) {
      actionsRef.current = actions
      setShow(true)
    },
    closeCommonPhrases() {
      setShow(false)
    }
  }
  contextRef.current = assign(contextRef.current, context)
  const rightBtnClick = useCallback(() => {
    actionsRef.current.send(selected.message)
  }, [actionsRef.current, selected])
  const aProps: any = { disabled: list.length >= 10 }
  const editProps: any = { disabled: !(list.length > 0) }
  return (
    <Modal
      showModal={show}
      handleModal={() => actionsRef.current?.close?.()}
      headerTitle={dic?.phraseTitle}
      firstButtonText={dic?.close}
      secondButtonText={dic?.send}
      firstButtonIsClose={false}
      secondButtonIsClose={false}
      isSecondButtonDisabled={!selected.id}
      handleFirstButton={() => actionsRef.current?.close?.()}
      handleSecondButton={rightBtnClick}
      isSecondButtonLoading={loading}
      isFirstButtonLoading={loading}
    >
      <div className={styles.modalContainer}>
        <div className={styles.formContainer}>
          <p>{dic?.pickDescription}</p>
          <RadioGroup
            aria-labelledby='demo-radio-buttons-group-label'
            defaultValue={selected?.id}
            name='radio-buttons-group'
          >
            {listLoading ? (
              <ContentLoader />
            ) : (
              list.map((phrase) => {
                return (
                  <FormControlLabel
                    key={phrase.id}
                    onClick={() => setSelected(phrase)}
                    value={phrase.id}
                    control={<Radio />}
                    label={<span className={styles.messageLabel}>{phrase.message}</span>}
                  />
                )
              })
            )}{' '}
          </RadioGroup>
          <span>
            <a
              onClick={() => editProps.disabled || actionsRef?.current?.modalEditList?.()}
              {...editProps}
            >
              {dic?.actionEdit}
            </a>{' '}
            {dic?.or}
            <a onClick={() => aProps.disabled || actionsRef?.current?.modalCreate()} {...aProps}>
             {' '}{dic?.actionCreate}{' '}
            </a>
            {dic?.actionDescription}
          </span>
        </div>
      </div>
    </Modal>
  )
}

export default CommonPhrasesModal
