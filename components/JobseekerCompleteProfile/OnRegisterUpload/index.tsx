import React from 'react'
import { isMobile } from 'react-device-detect'

// @ts-ignore
// Components
import Text from 'components/Text'
import OnBoardLayout from 'components/OnBoardLayout'
import MaterialButton from 'components/MaterialButton'
import Divider from '@mui/material/Divider'
// Styles
import styles from 'pages/[lang]/jobseeker-complete-profile/Onboard.module.scss'
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
    // resume
    lang,
  } = props
  const {profile} = lang || {}
  const {
    addYourResume,
    youCanBuildOnlineResume,
    youCanuploadYourResume,
    uploadYourResume,
    fileMax,
    resume,
    OR,
    createFreeResume,
    next,
    back
  } = profile || {}
  return (
    <OnBoardLayout
      headingText={
        <Text bold textStyle='xxxl' tagName='h2'>
          {addYourResume} 📄
        </Text>
      }
      currentStep={currentStep}
      totalStep={4}
      isMobile={isMobile}
      nextFnBtn={() => router.push(redirect)}
      backFnBtn={() => router.push('/jobseeker-complete-profile/1')}
      isNextDisabled={isDisabled}
      lang={lang?.profile}
    >
      <div className={styles.stepForm}>
        <Text className={styles.step2Caption} textStyle='lg'>
          {youCanBuildOnlineResume}{' '}
          <br />
          <br />{youCanuploadYourResume}
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
              {uploadYourResume}
            </Text>
            <input
              type='file'
              hidden
              accept='.pdf, .doc, .docx'
              onChange={(e) => setResume(e.target.files[0])}
            />
          </MaterialButton>
          <Text textColor='darkgrey' textStyle='xsm' className={styles.step2UploadAllowed}>
            {fileMax}
          </Text>
          {existingResume?.length ? (    
                existingResume.map(e=>(
                <Text key={e.id} textColor='darkgrey' textStyle='xsm' bold tagName='p'>
                       ({resume}:
                        <Link
                          to={e.url}
                          target='_blank'
                          rel='noreferrer'
                          style={{ textDecoration: 'underline' }}
                        >
                          {e.filename || e.name}
                        </Link>
                        )
            </Text>
                ))
          
            
          ):null}
        </div>

        <Text textStyle='lg' className={styles.step2UploadDivider}>
          {OR}
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
             {createFreeResume}
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
              <Text textColor='primaryBlue'>{back}</Text>
            </MaterialButton>

            <MaterialButton
              variant='contained'
              disabled={false}
              capitalize
              onClick={() => router.push(redirect)}
            >
              <Text textColor='white'>{next}</Text>
            </MaterialButton>
          </div>
        </React.Fragment>
      )}
    </OnBoardLayout>
  )
}

export default Step2
