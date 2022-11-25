/* eslint-disable no-unused-vars */
import Modal from 'components/Modal'
import React, { Ref, useCallback, useEffect, useRef, useState } from 'react'
import { assign } from 'lodash-es'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import styles from './index.module.scss'
import { getList, deleteOne } from 'helpers/interpreters/services/resume'
import Loader from 'react-content-loader'
import MaterialButton from 'components/MaterialButton'
import { uploadUserResumeService } from 'store/services/users/uploadUserResume'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import Text from 'components/Text'
import { maxFileSize } from 'helpers/handleInput'
import classNames from 'classnames'
import { TrashIcon } from 'images'

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
    const [resumeId, setResumeId] = useState(0)
    const [onlyOne, setOnlyOne] = useState(false)

    useEffect(() => {
        setResumeLoading(true)
        getList()
            .then(result => result.data.data)
            .then(list => {
                setResumeList(list)
                if (list?.length === 1) {
                    setOnlyOne(true)
                    setResumeId(list?.[0]?.id)
                }
            })
            .finally(() => setResumeLoading(false))
    }, [])
    const dispatch = useDispatch()
    const deleteItem = useCallback((item) => {
        setResumeLoading(true)
        deleteOne(item.id)
            .then(getList)
            .then(result => result.data.data)
            .then(setResumeList)
            .finally(() => setResumeLoading(false))
    }, [])
    const handleUploadResume = useCallback((e) => {
        const file = e.target.files[0]
        if (!maxFileSize(file, 5)) {
            dispatch(displayNotification({
                open: true,
                severity: 'error',
                message: 'File size is too huge. Please upload file that is within 5MB.'
            }))
            return
        }
        setResumeLoading(true)
        uploadUserResumeService(file)
            .then(getList)
            .then(result => result.data.data)
            .then(setResumeList)
            .finally(() => setResumeLoading(false))
            .catch(error => {
                dispatch(displayNotification({
                    open: true,
                    severity: 'error',
                    message: `Failed to upload resume with error: ${error.message}. 
            Please contact support@bossjob.com for assistance.`
                }))
            })
    }, [])
    const inputRef: Ref<any> = useRef()
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={'Send Resume'}
        firstButtonText='Cancel'
        secondButtonText='Send'
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current.close?.()}
        handleSecondButton={() => actionsRef.current.send?.({
            applicationId,
            requestResumeId: data.id,
            params: { resume_id: resumeId }
        })}
        isSecondButtonDisabled={!(resumeId > 0)}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <div>

            {(() => {
                if (resumeLoading) {
                    return <Loader style={{ width: '100%', height: '100%' }}>

                    </Loader>
                }
                else if (resumeList.length && !onlyOne) {
                    return <> <p>Please select the resume that you would like to share with recruiter.</p> <RadioGroup
                        aria-labelledby='demo-radio-buttons-group-label'
                        name='radio-buttons-group'
                        onChange={(e) => setResumeId(+e.target.value)}
                    >{resumeList.map(item => (
                        <div key={item.id} className={styles.item}>
                            <FormControlLabel
                                classes={{ root: styles.label }}
                                checked={item.id === resumeId}
                                value={item.id}
                                control={<Radio />}
                                label={<div className={styles.resumeName}>{item.name}</div>} />
                            <img src={TrashIcon} onClick={() => deleteItem(item)} />
                        </div>
                    ))}
                    </RadioGroup>
                        <p className={styles.bottomText}> Or upload a new resume {
                            resumeList.length >= 3 && '(only max. of 3 resumes can be uploaded, please delete at least 1 resume above)'
                        }</p>
                        <MaterialButton
                            className={classNames({
                                [styles.uploadButton]: true,
                                [styles.disabled]: resumeList.length >= 3
                            })}
                            type='button'
                            variant='outlined'
                            isLoading={resumeLoading}
                            onClick={() => {
                                inputRef?.current?.click?.()
                            }}
                            disabled={resumeList.length >= 3}
                        > <Text
                            textStyle='base'
                            textColor={resumeList.length >= 3 ? '#fff' : 'primaryBlue'}
                            bold
                        >
                                Upload your resume
                            </Text>
                            <input
                                type='file'
                                hidden
                                accept='.pdf, .doc, .docx'
                                onChange={handleUploadResume}
                                ref={inputRef}
                            />
                        </MaterialButton>
                    </>
                } else if (onlyOne) {
                    return <p>Are you sure you want to send your resume to the recruiter?</p>
                } else {
                    return null
                }
            })()

            }


        </div>
    </Modal>
}
export default SendResumeModal