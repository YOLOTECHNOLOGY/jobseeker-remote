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
import FileLogo from './logo'

type UploadButtonProps = {
  disabled?: boolean
  onChange: (event: React.ChangeEvent) => void,
  dic: any
}

const UploadButton = ({ disabled = false, onChange, dic }: UploadButtonProps) => {
  const inputRef: Ref<HTMLInputElement> = useRef()
  const { uploadYourResume, supportedFileType } = dic || {}
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

const EnableAutoSendResumeModal = (props: any) => {
  const [show, setShow] = useState(false)
  const { contextRef, loading, data, applicationId, dic, lang } = props
  const actionsRef = useRef({} as any)
  const { fileSizeIsTooHuge,
    failedToUploadResume,
    pleaseContactSupport,
    enableAutoSendTitle,
    pleaseSelectResume,
    orUploadNewResume,
    onlyMax3Resumes,
    uploadNewResume,
    enableDescription,
    warnText,
    cancel,
    send
  } = dic || {}
  const context = {
    showEnableAutoResume(actions) {
      actionsRef.current = actions
      setShow(true)
    },

    closeEnableAutoSendResume() {
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
  console.log({ resumeList })
  return (
    <Modal
      showModal={show}
      handleModal={() => actionsRef.current.close?.()}
      headerTitle={enableAutoSendTitle}
      firstButtonText={cancel}
      secondButtonText={send}
      firstButtonIsClose={false}
      secondButtonIsClose={false}
      handleFirstButton={() => actionsRef.current.close?.()}
      handleSecondButton={() =>
        actionsRef.current.send?.(resumeId)
      }
      isSecondButtonDisabled={!(resumeId > 0)}
      isSecondButtonLoading={loading}
      isFirstButtonLoading={loading}
    >
      <div className={styles.description}>{enableDescription}</div>
      <div className={styles.warnContainer}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.08301 5.41732H10.9163V7.25065H9.08301V5.41732ZM9.08301 9.08398H10.9163V14.584H9.08301V9.08398ZM9.99967 0.833984C4.93967 0.833984 0.833008 4.94065 0.833008 10.0007C0.833008 15.0607 4.93967 19.1673 9.99967 19.1673C15.0597 19.1673 19.1663 15.0607 19.1663 10.0007C19.1663 4.94065 15.0597 0.833984 9.99967 0.833984ZM9.99967 17.334C5.95717 17.334 2.66634 14.0431 2.66634 10.0007C2.66634 5.95815 5.95717 2.66732 9.99967 2.66732C14.0422 2.66732 17.333 5.95815 17.333 10.0007C17.333 14.0431 14.0422 17.334 9.99967 17.334Z" fill="#2196F3" />
        </svg>

        <div className={styles.warnText}>{warnText}</div>
      </div>
      <div>
        {(() => {
          if (resumeLoading) {
            return <Loader style={{ width: '100%', height: '100%' }}></Loader>
          }
          if (resumeList.length === 1) {
            const item = resumeList[0]
            return (
              <>
                <div 
                key={item.id} 
                className={styles.item}
                onClick={()=>{
                  if(item?.url){
                    window?.open(item?.url)
                  }
                }}
                >
                  <FileLogo />
                  <div style={{ width: 20 }} />
                  <FormControlLabel
                    classes={{ root: styles.label }}
                    checked={item.id === resumeId}
                    value={item.id}
                    control={<div />}
                    label={<div className={styles.resumeName}>{item.name}</div>}
                  />
                </div>
                <p className={styles.bottomText}>
                  {orUploadNewResume}
                  {resumeList.length >= 3 &&
                    `(${onlyMax3Resumes})`}
                </p>
                <UploadButton onChange={handleUploadResume} disabled={resumeList.length >= 3} dic={dic} />
              </>
            )
          } else if (resumeList.length) {
            return (
              <>
                <p>{pleaseSelectResume}</p>
                <RadioGroup
                  name='radio-buttons-group'
                  onChange={(e) => setResumeId(+e.target.value)}
                >
                  {resumeList.map((item) => (
                    <div key={item.id} className={styles.item} >

                      <FormControlLabel
                        classes={{ root: styles.label }}
                        checked={item.id === resumeId}
                        value={item.id}
                        control={<Radio />}
                        label={<div className={styles.fileContainer} onClick={()=>{
                          if(item?.url){
                            window?.open(item?.url)
                          }
                        }}>
                          <FileLogo />
                          <div className={styles.resumeName}>{item.name}</div>
                        </div>}
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
                <UploadButton onChange={handleUploadResume} disabled={resumeList.length >= 3} dic={dic} />
              </>
            )
          }
          return (
            <>
              <p>{uploadNewResume}</p>
              <UploadButton onChange={handleUploadResume} dic={dic} />
            </>
          )
        })()}
      </div>
    </Modal>
  )
}

export default EnableAutoSendResumeModal
