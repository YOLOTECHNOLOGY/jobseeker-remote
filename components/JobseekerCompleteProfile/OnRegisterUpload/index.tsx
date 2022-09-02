import React from 'react'
import { isMobile } from 'react-device-detect'

// @ts-ignore
// Components
import Text from 'components/Text'
import OnBoardLayout from 'components/OnBoardLayout'
import MaterialButton from 'components/MaterialButton'
import Divider from '@mui/material/Divider'
// Styles
import styles from 'pages/jobseeker-complete-profile/Onboard.module.scss'
import Link from 'components/Link'
import { useRouter } from 'next/router'

const Step2 = (props: any) => {
  const router = useRouter()
  const {
    existingResume,
    isDisabled,
    errorMessage,
    isCreatingResume,
    setIsCreatingResume,
    isDoneUpdating,
    isUploading,
    setResume,
    redirect,
    currentStep,
    resume
  } = props

  return (
    <OnBoardLayout
      headingText={
        <Text bold textStyle='xxxl' tagName='h2'>
          Add your resume 📄
        </Text>
      }
      currentStep={currentStep}
      totalStep={4}
      isMobile={isMobile}
      nextFnBtn={() => router.push(redirect)}
      backFnBtn={() => router.push('/jobseeker-complete-profile/1')}
      isNextDisabled={isDisabled}
    >
      <div className={styles.stepForm}>
        <Text className={styles.step2Caption} textStyle='lg'>
          You can build an online resume to apply for jobs and export it with different templates.{' '}
          <br />
          <br /> You can also upload your resume, it will be saved to your profile.
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
              onChange={(e) => setResume(e.target.files[0])}
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
              localStorage.setItem('isCreateFreeResume', 'true')
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
      {isMobile && (
        <React.Fragment>
          <Divider className={styles.divider} />

          <div className={styles.stepFormActions}>
            <MaterialButton
              className={styles.stepFormActionsleftBtn}
              variant='outlined'
              capitalize
              onClick={() => router.push('/jobseeker-complete-profile/1')}
            >
              <Text textColor='primaryBlue'>Back</Text>
            </MaterialButton>

            <MaterialButton
              variant='contained'
              disabled={isDisabled}
              capitalize
              onClick={() => router.push(redirect)}
            >
              <Text textColor='white'>Next</Text>
            </MaterialButton>
          </div>
        </React.Fragment>
      )}
    </OnBoardLayout>
  )
}

export default Step2
