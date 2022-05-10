import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
// @ts-ignore
import { END } from 'redux-saga'

/* Redux Actions */
import { wrapper } from 'store'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { uploadUserResumeRequest } from 'store/actions/users/uploadUserResume'

// Components
import Text from 'components/Text'
import OnBoardLayout from 'components/OnBoardLayout'
import MaterialButton from 'components/MaterialButton'

// Styles
import styles from './Onboard.module.scss'

const Step2 = (props: any) => {
  const currentStep = 2
  const router = useRouter()
  const dispatch = useDispatch()
  const { userDetail, accessToken } = props
  const redirect = router.query?.redirect ? `/jobseeker-complete-profile/1101?redirect=${router.query.redirect}` : '/jobseeker-complete-profile/1101'

  const [resumeName, setResumeName] = useState(null)
  const [resume, setResume] = useState(null)
  const [isDisabled, setIsDisabled] = useState(userDetail.resume ? false : true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isCreatingResume, setIsCreatingResume] = useState(false)
  const [isDoneUpdating, setIsDoneUpdating] = useState(false)

  const isUploading = useSelector((store: any) => store.users.uploadUserResume.fetching)
  const uploadUserResumeState = useSelector((store: any) => store.users.uploadUserResume)

  useEffect(() => {
    if (userDetail) {
      setResumeName(userDetail.resume?.filename || null)
    }
    setErrorMessage(null)
  }, [])

  useEffect(() => {
    if (uploadUserResumeState.error?.errors?.file[0]) {
      setErrorMessage(uploadUserResumeState.error.errors.file[0])
    }
  }, [uploadUserResumeState])

  useEffect(() => {
    if (resume) {
      if (localStorage.getItem('isCreateFreeResume')) localStorage.removeItem('isCreateFreeResume')
      setIsDoneUpdating(true)

      const payload = {
        redirect,
        resume,
        accessToken
      }
      dispatch(uploadUserResumeRequest(payload))

      setIsDisabled(false)
    }
  }, [resume])
  
  return (
    <OnBoardLayout
      headingText={<Text bold textStyle='xxxl' tagName='h2'>Add your resume 📄</Text>}
      currentStep={currentStep}
      totalStep={4}
      nextFnBtn={() => router.push(redirect)}
      backFnBtn={() => router.push('/jobseeker-complete-profile/1')}
      isDisabled={isDisabled}
    >
      <div className={styles.stepForm}>
        <Text className={styles.step2Caption} textStyle='xl'>
          You can build an online resume to apply for jobs and export it <br/> with different templates. You can also upload your resume, it <br/>will be saved to your profile.
        </Text>

        <div className={styles.step2Upload}>
          {errorMessage && (
            <Text textColor='red' textStyle='xsm' className={styles.step2UploadError}>{errorMessage}</Text>
          )}

          <MaterialButton isLoading={isUploading || isDoneUpdating} capitalize variant="contained" component="label" >
            <Text textColor='white' bold>Upload your Resume</Text>
            <input type="file" hidden accept=".pdf, .doc, .docx" onChange={(e) => setResume(e.target.files[0])}/>
          </MaterialButton>
          <Text textColor='darkgrey' textStyle='xsm' className={styles.step2UploadAllowed}>PDF, DOC, DOCX. file, max 5MB</Text>
          {resumeName && <Text textColor='darkgrey' textStyle='xsm' bold tagName='p'>(Resume: { resumeName })</Text>}
        </div>

        <Text textStyle='lg' className={styles.step2UploadDivider}>OR</Text>

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
            <Text textColor='primary' bold>Create Free Resume</Text>
          </MaterialButton>
        </div>
      </div>
    </OnBoardLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return { 
      redirect: { 
        destination: '/login/jobseeker?redirect=/jobseeker-complete-profile/10', 
        permanent: false, 
      }
    }
  }

  store.dispatch(fetchUserOwnDetailRequest({accessToken}))
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const userDetail = storeState.users.fetchUserOwnDetail.response

  return {
    props: {
      userDetail,
      accessToken
    },
  }
})

export default Step2