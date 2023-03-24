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
  onChange: (event: React.ChangeEvent) => void
}

const UploadButton = ({ disabled = false, onChange }: UploadButtonProps) => {
  const inputRef: Ref<HTMLInputElement> = useRef()

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
          Upload your resume
        </Text>
        <input type='file' hidden accept='.pdf, .doc, .docx' onChange={onChange} ref={inputRef} />
      </MaterialButton>
      <label className={styles.fileLabel}>
        Supported file type: PDF, DOC, DOCX. Max. file size: 5MB
      </label>
    </>
  )
}

const SendResumeModal = (props: any) => {
  const [show, setShow] = useState(false)
  const { contextRef, loading, data, applicationId } = props
  const actionsRef = useRef({} as any)

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
          message: 'File size is too huge. Please upload file that is within 5MB.'
        })
      )
      return
    }
    getResumes(uploadUserResumeService(file)).catch((error) => {
      dispatch(
        displayNotification({
          open: true,
          severity: 'error',
          message: `Failed to upload resume with error: ${error.message}. 
            Please contact support@bossjob.com for assistance.`
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
      headerTitle={'Send Resume'}
      firstButtonText='Cancel'
      secondButtonText='Send'
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
                <p>Please select the resume that you would like to share with recruiter.</p>
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
                  Or upload a new resume
                  {resumeList.length >= 3 &&
                    '(only max. of 3 resumes can be uploaded, please delete at least 1 resume above)'}
                </p>
                <UploadButton onChange={handleUploadResume} disabled={resumeList.length >= 3} />
              </>
            )
          }
          return (
            <>
              <p>Upload a new resume</p>
              <UploadButton onChange={handleUploadResume} />
            </>
          )
        })()}
      </div>
    </Modal>
  )
}

export default SendResumeModal
