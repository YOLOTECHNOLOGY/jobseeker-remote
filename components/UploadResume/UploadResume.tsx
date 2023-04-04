import React, { useState } from 'react'

/* Components */
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'
import Link from 'components/Link'

/* Helpers */
import { maxFileSize } from 'helpers/handleInput'

/* Styles */
import styles from './UploadResume.module.scss'
import classNames from 'classnames'

/* Assets */
import { TrashIcon, DocumentIcon } from 'images'
import format from 'date-fns/format'
import { SnackbarTips } from './SnackbarTips'

type resumeObject = {
  name: string
  url: string
  id: number
  updated_at: string
}

type UploadResumeProps = {
  title: string
  resumes: resumeObject[]
  handleDelete: Function
  handleUpload: Function
  buttonClassname?: string
  deleteResumeLoading?: boolean
}

const Trash = ({
  deleteResumeLoading,
  onClick
}: {
  deleteResumeLoading: boolean
  onClick: () => void
}) => {
  return (
    <div
      className={classNames([
        styles.trashDiv,
        deleteResumeLoading ? styles.disabledDelResume : null
      ])}
    >
      <img
        className={classNames([
          styles.trashDiv_icon,
          deleteResumeLoading ? styles.disabledDelResume_icon : null
        ])}
        src={TrashIcon}
        alt='trash'
        width='14'
        height='14'
        onClick={onClick}
      />
    </div>
  )
}

const UploadResume = ({
  resumes,
  handleDelete,
  handleUpload,
  buttonClassname,
  deleteResumeLoading
}: UploadResumeProps) => {
  const [isExceedLimit, setIsExceedLimit] = useState(false)

  const handleOnFileChange = (e) => {
    const file = e.target.files[0]
    if (!maxFileSize(file, 5)) {
      setIsExceedLimit(true)
      return
    }
    handleUpload?.(file)
  }

  const handleDeleteResume = (e) => {
    handleDelete?.(e)
  }
  const displayClear = resumes.length > 1
  return (
    <>
      <div className={styles.uploadResumeField}>
        {resumes.length &&
          resumes.map((item, index) => {
            return (
              <>
                <div key={index} className={styles.uploadedResume}>
                  <div className={styles.leftResume}>
                    <div className={styles.documentDiv}>
                      <img src={DocumentIcon} alt='document' width='21' height='21' />
                    </div>
                    <div>
                      <Link to={item?.url} external>
                        <Text textStyle='lg' bold className={styles.resumeName}>
                          {item?.name}
                        </Text>
                      </Link>
                      <div className={styles.resumeTime}>
                        Uploaded On {format(new Date(item.updated_at), 'd MMMM yyyy')}
                      </div>
                    </div>
                  </div>
                  {displayClear && (
                    <Trash
                      deleteResumeLoading={deleteResumeLoading}
                      onClick={() => handleDeleteResume(item.id)}
                    />
                  )}
                </div>
              </>
            )
          })}
        {!resumes.length && (
          <div>
            <MaterialButton
              variant='outlined'
              capitalize
              component='label'
              className={classNames([styles.buttonCTA, buttonClassname])}
            >
              <Text textStyle='base' textColor='primaryBlue' bold>
                Upload your resume
              </Text>
              <input
                type='file'
                hidden
                accept='.pdf, .doc, .docx'
                onChange={(e) => handleOnFileChange(e)}
              />
            </MaterialButton>
          </div>
        )}
        <Text textColor='darkgrey' textStyle='sm'>
          Supported file type: PDF, DOC, DOCX. Max. file size: 5MB
        </Text>
      </div>
      <SnackbarTips
        show={isExceedLimit}
        onDismiss={() => {
          setIsExceedLimit(false)
        }}
      />
    </>
  )
}

export default UploadResume
