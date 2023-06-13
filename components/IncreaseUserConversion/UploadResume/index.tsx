import React from 'react'

// @ts-ignore
// Components
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'
// Styles
import styles from './styles.module.scss'
import Link from 'components/Link'
import { setItem } from 'helpers/localStorage'
import { useDispatch } from 'react-redux'

import { fetchUserWorkExperienceQuickUploadResume } from 'store/actions/users/fetchUserWorkExperience'
import { useRouter } from 'next/router'

const UploadResume = (props: any) => {
  const dispatch = useDispatch()
  const {
    existingResume,
    errorMessage,
    isCreatingResume,
    setIsCreatingResume,
    isDoneUpdating,
    isUploading,
    setResume,
    resume,
    lang,
    isLogged,
  } = props
  const { quickUploadResume } = lang
  const router = useRouter()

  const handleRedirect = () => {
    if (isLogged) {
      router.push('/manage-profile')
    }
  }
  
  const handleUploadResume = (event:any) => {
    const file = event.target?.files[0]
    if(!file) return
    if(!isLogged) {
      setResume(file)
      setItem('quickUpladResume', 'upFile')
    }else {
      handleRedirect()
    }
    // reset file value
    event.target.value = ''
  }

  const createOnlineResume = () => {
    if(!isLogged) {
      dispatch(fetchUserWorkExperienceQuickUploadResume({ hasNoWorkExperience: true }))
      setItem('quickUpladResume', 'onLine')
      setIsCreatingResume(true)
    }else {
      handleRedirect()
    }
  }

  return (
    <div>
      <div className={styles.stepForm}>
        <div className={styles.stepForm_title}>
          <Text bold textStyle='xxxl' tagName='h2'>
            {' '}
            {quickUploadResume.title} 📄
          </Text>
        </div>
        <Text className={styles.step2Caption} textStyle='lg'>
          {quickUploadResume.UploadAndApply}
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
            {
              isLogged ? (
                <Text textColor='white' bold onClick={handleRedirect}>
                  {quickUploadResume.uploadBtn}
                </Text>
              ) : (
                <>
                  <Text textColor='white' bold>
                    {/* Upload your Resume */}
                    {quickUploadResume.uploadBtn}
                  </Text>
                  <input
                    type='file'
                    hidden
                    accept='.pdf, .doc, .docx'
                    onChange={handleUploadResume}
                  />
                </>
              )
            }
          </MaterialButton>
          <Text textColor='darkgrey' textStyle='xsm' className={styles.step2UploadAllowed}>
            {/* PDF, DOC, DOCX. file, max 5MB */}
            {quickUploadResume.uploadTips}
          </Text>
          {existingResume && (
            <Text textColor='darkgrey' textStyle='xsm' bold tagName='p'>
              ( {quickUploadResume.resume}:{resume?.name}
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
          {quickUploadResume.or}
        </Text>

        <div className={styles.step2Create}>
          <MaterialButton
            variant='outlined'
            size='large'
            capitalize
            isLoading={isCreatingResume}
            onClick={createOnlineResume}
          >
            <Text textColor='primary' bold>
              {quickUploadResume.createFreeResume}
            </Text>
          </MaterialButton>
        </div>
      </div>
    </div>
  )
}

export default UploadResume
