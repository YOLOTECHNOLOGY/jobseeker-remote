/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react'
import FileLogo from './logo'
import { assign } from 'lodash-es'

import Modal from 'components/Modal'

import styles from './index.module.scss'



const DisableAutoSendResumeModal = (props: any) => {
  const [show, setShow] = useState(false)
  const { contextRef, loading, applicationId, dic } = props
  const actionsRef = useRef({} as any)
  const { disabledDescription,
    disabledAutoSendTitle,
    change,
    cancel
  } = dic || {}
  const [data, setData] = useState<any>({}) // the selected resume's id, 0 indicate nothing selected

  const context = {
    showDisableAutoResume(actions) {
      actionsRef.current = actions
      setShow(true)
      setData(actions.data)
    },

    closeDisableAutoSendResume() {
      setShow(false)
    }
  }
  contextRef.current = assign(contextRef.current, context)
  return (
    <Modal
      showModal={show}
      handleModal={() => actionsRef.current.close?.()}
      headerTitle={disabledAutoSendTitle}
      firstButtonText={change}
      secondButtonText={cancel}
      firstButtonIsClose={false}
      secondButtonIsClose={false}
      handleFirstButton={() => actionsRef.current.change?.()}
      handleSecondButton={() =>
        actionsRef.current.send?.()
      }
      isSecondButtonDisabled={false}
      isSecondButtonLoading={loading}
      isFirstButtonLoading={loading}
    >
      <div className={styles.description}>{disabledDescription}</div>
      <div  className={styles.fileContainer} onClick={() => {
        if(data?.auto_sent_resume?.url) {
          window.open(data?.auto_sent_resume?.url)
        }
      }}>
        <FileLogo />
        <span> {data?.auto_sent_resume?.name}</span>
      </div>
    </Modal>
  )
}

export default DisableAutoSendResumeModal
