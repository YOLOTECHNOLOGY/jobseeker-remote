/* eslint-disable no-unused-vars */
import React, { Ref, useCallback, useEffect, useRef, useState } from 'react'
import Loader from 'react-content-loader'
import { useDispatch } from 'react-redux'

import { assign } from 'lodash-es'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import classNames from 'classnames'

import { getList, deleteOne } from 'helpers/interpreters/services/resume'
import { uploadUserResumeService } from 'store/services/users/uploadUserResume'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'
import Modal from 'components/Modal'
import { maxFileSize } from 'helpers/handleInput'
import { TrashIcon } from 'images'

import styles from './index.module.scss'

type UploadButtonProps = {
  disabled?: boolean
  onChange: (event: React.ChangeEvent) => void,
  lang:any
}

const UploadButton = ({ disabled = false, onChange,lang }: UploadButtonProps) => {
  const inputRef: Ref<HTMLInputElement> = useRef()
  const {uploadYourResume,supportedFileType} = lang || {}
  return (
    <>
      <MaterialButton
        className={classNames({
          [styles.uploadButton]: true,
          [styles.disabled]: disabled
        })}
        type='button'
        variant='outlined'
        onClick={() => {
          inputRef?.current?.click?.()
        }}
        disabled={disabled}
      >
        <Text textStyle='base' textColor={disabled ? '#fff' : 'primaryBlue'} bold>
          {uploadYourResume}
        </Text>
        <input type='file' hidden accept='.pdf, .doc, .docx' onChange={onChange} ref={inputRef} />
      </MaterialButton>
      <label className={styles.fileLabel}>
        {supportedFileType}
      </label>
    </>
  )
}

const SendResumeModal = (props: any) => {
  const [show, setShow] = useState(false)
  const { contextRef, loading, data, applicationId,lang } = props
  const actionsRef = useRef({} as any)
  const {fileSizeIsTooHuge,
    failedToUploadResume,
    pleaseContactSupport,
    sendResume,
    pleaseSelectResume,
    orUploadNewResume,
    onlyMax3Resumes,
    uploadNewResume,
    cancel,
    send
  } = lang || {}
  const context = {
    showSendResume(actions) {
      actionsRef.current = actions
      setShow(true)
    },

    closeSendResume() {
      setShow(false)
    }
  }
  contextRef.current = assign(contextRef.current, context)

  const [resumeLoading, setResumeLoading] = useState(false)
  const [resumeList, setResumeList] = useState([])
  const [resumeId, setResumeId] = useState(0) // the selected resume's id, 0 indicate nothing selected
  const dispatch = useDispatch()
  const getResumes = useCallback((prePromise: Promise<any> = Promise.resolve()) => {
    setResumeLoading(true)
    return prePromise
      .then(getList)
      .then((result) => result.data.data)
      .then((list) => {
        setResumeList(list)
        setResumeId(list?.[0]?.id || 0)
      })
      .finally(() => setResumeLoading(false))
  }, [])

  const deleteItem = useCallback((item) => {
    getResumes(deleteOne(item.id))
  }, [])

  const handleUploadResume = useCallback((e) => {
    const file = e.target.files[0]
    if (!maxFileSize(file, 5)) {
      dispatch(
        displayNotification({
          open: true,
          severity: 'error',
          message: fileSizeIsTooHuge
        })
      )
      return
    }
    getResumes(uploadUserResumeService(file)).catch((error) => {
      dispatch(
        displayNotification({
          open: true,
          severity: 'error',
          message: `${failedToUploadResume}: ${error.message}. ${pleaseContactSupport}`
        })
      )
    })
  }, [])

  useEffect(() => {
    // Once the client access the chat page, we should request the latest resume from the server
    if (location.pathname.includes('/chat')) {
      getResumes()
    }
  }, [location.pathname])

  return (
    <Modal
      showModal={show}
      handleModal={() => actionsRef.current.close?.()}
      headerTitle={sendResume}
      firstButtonText={cancel}
      secondButtonText={send}
      firstButtonIsClose={false}
      secondButtonIsClose={false}
      handleFirstButton={() => actionsRef.current.close?.()}
      handleSecondButton={() =>
        actionsRef.current.send?.({
          applicationId,
          requestResumeId: data?.id,
          resume_id: resumeId
        })
      }
      isSecondButtonDisabled={!(resumeId > 0)}
      isSecondButtonLoading={loading}
      isFirstButtonLoading={loading}
    >
      <div>
        {(() => {
          if (resumeLoading) {
            return <Loader style={{ width: '100%', height: '100%' }}></Loader>
          }
          if (resumeList.length) {
            return (
              <>
                <p>{pleaseSelectResume}</p>
                <RadioGroup
                  name='radio-buttons-group'
                  onChange={(e) => setResumeId(+e.target.value)}
                >
                  {resumeList.map((item) => (
                    <div key={item.id} className={styles.item}>
                      <FormControlLabel
                        classes={{ root: styles.label }}
                        checked={item.id === resumeId}
                        value={item.id}
                        control={<Radio />}
                        label={<div className={styles.resumeName}>{item.name}</div>}
                      />
                      <img
                        src={TrashIcon}
                        onClick={() => {
                          if (item.id === resumeId) {
                            setResumeId(0) // the selected resume will be removed
                          }
                          deleteItem(item)
                        }}
                      />
                    </div>
                  ))}
                </RadioGroup>
                <p className={styles.bottomText}>
                 {orUploadNewResume}
                  {resumeList.length >= 3 &&
                    `(${onlyMax3Resumes})`}
                </p>
                <UploadButton onChange={handleUploadResume} disabled={resumeList.length >= 3} lang={lang}/>
              </>
            )
          }
          return (
            <>
              <p>{uploadNewResume}</p>
              <UploadButton onChange={handleUploadResume} lang={lang}/>
            </>
          )
        })()}
      </div>
    </Modal>
  )
}

export default SendResumeModal
