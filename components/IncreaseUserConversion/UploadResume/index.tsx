import React from 'react'

// @ts-ignore
// Components
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'
// Styles
import styles from './styles.module.scss'
import Link from 'components/Link'
import { useRouter } from 'next/router'
import { setItem } from 'helpers/localStorage'

const UploadResume = (props: any) => {
  const router = useRouter()
  const {
    existingResume,
    errorMessage,
    isCreatingResume,
    setIsCreatingResume,
    isDoneUpdating,
    isUploading,
    setResume,
    redirect,
    resume
  } = props

  return (
    <div>
      <div className={styles.stepForm}>
        <div className={styles.stepForm_title}>
          <Text bold textStyle='xxxl' tagName='h2'>
            {' '}
            Upload your resume 📄
          </Text>
        </div>
        <Text className={styles.step2Caption} textStyle='lg'>
          Upload your resume and start applying for job now!
          <br />
          <br />
        </Text>

        <div className={styles.step2Upload}>
          {errorMessage && (
            <Text textColor='red' textStyle='xsm' className={styles.step2UploadError}>
              {errorMessage}
            </Text>
          )}

          <MaterialButton
            isLoading={isUploading || isDoneUpdating}
            capitalize
            variant='contained'
            component='label'
          >
            <Text textColor='white' bold>
              Upload your Resume
            </Text>
            <input
              type='file'
              hidden
              accept='.pdf, .doc, .docx'
              onChange={(e) => {
                if (e.target?.files[0]) {
                  setResume(e.target.files[0])
                }
                setItem('quickUpladResume', 'upFile')
              }}
            />
          </MaterialButton>
          <Text textColor='darkgrey' textStyle='xsm' className={styles.step2UploadAllowed}>
            PDF, DOC, DOCX. file, max 5MB
          </Text>
          {existingResume && (
            <Text textColor='darkgrey' textStyle='xsm' bold tagName='p'>
              (Resume:{resume?.name}
              <Link to={existingResume.url}>
                <a target='_blank' rel='noreferrer' style={{ textDecoration: 'underline' }}>
                  {existingResume.filename}
                </a>
              </Link>
              )
            </Text>
          )}
        </div>

        <Text textStyle='lg' className={styles.step2UploadDivider}>
          OR
        </Text>

        <div className={styles.step2Create}>
          <MaterialButton
            variant='outlined'
            size='large'
            capitalize
            isLoading={isCreatingResume}
            onClick={() => {
              setItem('quickUpladResume', 'onLine')
              setIsCreatingResume(true)
              router.push(redirect)
            }}
          >
            <Text textColor='primary' bold>
              Create Free Resume
            </Text>
          </MaterialButton>
        </div>
      </div>
    </div>
  )
}

export default UploadResume
