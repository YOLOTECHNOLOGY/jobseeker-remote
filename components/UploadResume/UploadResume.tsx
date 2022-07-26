import React from 'react'

/* Vendors */
import { useForm } from 'react-hook-form'

/* Components */
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'

/* Helpers */
import { maxFileSize } from 'helpers/handleInput'

/* Styles */
import styles from './UploadResume.module.scss'

/* Assets */
import { TrashIcon, DocumentIcon } from 'images'

type UploadResume = {
  title: string
  resume: resumeObject
  handleDelete: Function
  handleUpload: Function
}

type resumeObject = {
  name: string
}

const UploadResume = ({ title, resume, handleDelete, handleUpload }: UploadResume) => {
  const {
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm()

  const handleOnFileChange = (e) => {
    const file = e.target.files[0]
    if (!maxFileSize(file, 5)) {
      setError(title, {
        type: 'custom',
        message: 'File size is too huge. Please upload file that is within 5MB.',
      })
      return
    }

    if (handleUpload) handleUpload(file)
  }

  const handleDeleteResume = (e) => {
    clearErrors(title)
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
            <Text textStyle='sm' bold className={styles.resumeName}>
              {' '}
              {resume?.name}{' '}
            </Text>
          </div>
          <div className={styles.trashDiv}>
            <img
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
          <MaterialButton variant='outlined' capitalize component='label'>
            <Text textStyle='base' textColor='primaryBlue' bold>
              Upload your resume
            </Text>
            <input
              {...register(title, {
                required: {
                  value: true,
                  message: 'Please upload your resume.',
                },
              })}
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

      {errors.resume && (
        <Text textStyle='sm' textColor='red' tagName='p' className={styles.error}>
          {errors.resume.message}
        </Text>
      )}
    </div>
  )
}

export default UploadResume
