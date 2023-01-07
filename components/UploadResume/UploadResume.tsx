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

type UploadResumeProps = {
  title: string
  resume: resumeObject
  handleDelete: Function
  handleUpload: Function
  buttonClassname?: string
  deleteResumeLoading?: boolean
}

type resumeObject = {
  name: string
  url: string
}

const UploadResume = ({
  resume,
  handleDelete,
  handleUpload,
  buttonClassname,
  deleteResumeLoading
}: UploadResumeProps) => {
  const [error, setError] = useState(null)

  const handleOnFileChange = (e) => {
    const file = e.target.files[0]
    if (!maxFileSize(file, 5)) {
      setError('File size is too huge. Please upload file that is within 5MB.')
      return
    }

    setError(null)
    if (handleUpload) handleUpload(file)
  }

  const handleDeleteResume = (e) => {
    setError(null)
    if (handleDelete) handleDelete(e)
  }

  return (
    <div className={styles.uploadResumeField}>
      {resume ? (
        <div className={styles.uploadedResume}>
          <div className={styles.leftResume}>
            <div className={styles.documentDiv}>
              <img src={DocumentIcon} alt='document' width='21' height='21' />
            </div>
            <Link to={resume?.url} external>
              <Text textStyle='sm' bold className={styles.resumeName}>
                {' '}
                {resume?.name}{' '}
              </Text>
            </Link>
          </div>
          <div
            className={classNames([
              styles.trashDiv,
              deleteResumeLoading ? styles.disabledDelResume : null
            ])}
          >
            <img
              className={deleteResumeLoading ? styles.disabledDelResume_icon : null}
              src={TrashIcon}
              alt='trash'
              width='14'
              height='14'
              onClick={(e) => handleDeleteResume(e)}
            />
          </div>
        </div>
      ) : (
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
      <Text textColor='darkgrey' textStyle='xsm'>
        Supported file type: PDF, DOC, DOCX. Max. file size: 5MB
      </Text>

      {error && (
        <Text textStyle='sm' textColor='red' tagName='p' className={styles.error}>
          {error}
        </Text>
      )}
    </div>
  )
}

export default UploadResume
