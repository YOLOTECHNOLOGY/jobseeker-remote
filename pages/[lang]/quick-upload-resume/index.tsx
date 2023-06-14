import React, { useMemo } from 'react'
import Text from 'components/Text'
import { BossjobLogo, increaseUserConversionModelBg, increaseUserConversionBrush } from 'images'
import QuickLayout from 'components/IncreaseUserConversion/quickLayout/quickLayout'
import UploadResume from 'components/IncreaseUserConversion/UploadResume'
import RegisterInfo from 'components/IncreaseUserConversion/RegisterInfo'

import LinearProgress from '@mui/material/LinearProgress'

import useRegister from 'hooks/useRegister'
import useFakeUploadResume from 'hooks/useFakeUploadResume'

import styles from './styles.module.scss'
import { getCountry } from 'helpers/country'
import { getDictionary } from 'get-dictionary'
import { getCookie } from 'helpers/cookies'
// import { useSelector } from 'react-redux'

const QuickUploadResume = (props: { lang: any }) => {
  const { lang } = props
  const UseHooksRegister = useRegister()
  const useHooksFakeUploadResume = useFakeUploadResume()
  const { isLoading, isShowRegisterInfo, userWorkExperiences } = UseHooksRegister
  const user = getCookie('user')
  const accessToken = getCookie('accessToken')
  const isLogged = useMemo(() => !!accessToken && !!user, [user])

  return (
    <QuickLayout lang={lang}>
      <div className={styles.AuthLayout}>
        <div className={styles.AuthLayoutBody}>
          <div className={styles.wrapper}>
            <div className={styles.loadingWrapper}></div>
          </div>
          <div className={styles.AuthWrapper}>
            <div className={styles.AuthWrapperImage}>
              <div className={styles.AuthWrapperImageTitle}>
                <div
                  className={styles.AuthWrapperImageTitleLineBg}
                  style={{ backgroundImage: 'url(' + increaseUserConversionBrush + ')' }}
                >
                  <Text
                    textColor='white'
                    textStyle='xxxl'
                    block
                    bold
                    className={styles.AuthWrapperImageTitle_context}
                  >
                    Chat with
                  </Text>
                </div>
                <Text
                  textColor='white'
                  textStyle='xxxl'
                  block
                  bold
                  className={styles.AuthWrapperImageTitle_context}
                >
                  Boss to get
                </Text>
                <Text
                  textColor='white'
                  textStyle='xxxl'
                  block
                  bold
                  className={styles.AuthWrapperImageTitle_context}
                >
                  your next
                </Text>
                <Text
                  textColor='white'
                  textStyle='xxxl'
                  block
                  bold
                  className={styles.AuthWrapperImageTitle_context}
                >
                  offer!
                </Text>
              </div>
              <div className={styles.AuthWrapperImageContext}>
                <img src={increaseUserConversionModelBg} />
              </div>
            </div>
            <div className={styles.AuthWrapperInfo}>
              {isLoading ? (
                <div className={styles.AuthWrapperLoading}>
                  <div className={styles.loadingLogo}>
                    <img src={BossjobLogo} title='Bossjob logo' alt='Bossjob logo' />
                  </div>
                  <div className={styles.loadingIndicator}>
                    <LinearProgress />
                  </div>
                  <Text textStyle='lg'>
                    {userWorkExperiences?.hasNoWorkExperience
                      ? 'Please hold on while we are preparing your resume.'
                      : 'Please hold on while we are parsing your resume'}
                  </Text>
                </div>
              ) : null}

              {(isShowRegisterInfo() && !isLogged) ? (
                <RegisterInfo {...UseHooksRegister} lang={lang} hideSocialMediaAuth />
              ) : (
                <UploadResume {...useHooksFakeUploadResume} isLogged={isLogged} lang={lang} />
              )}
            </div>
          </div>
        </div>
      </div>
    </QuickLayout>
  )
}

export const getServerSideProps = async (props) => {
  const { lang } = props.query
  const dic = await getDictionary(lang)
  return {
    props: {
      lang: dic,
      seoMetaTitle: 'Sign Up | Bossjob',
      canonicalUrl: '/register/jobseeker',
      seoMetaDescription: `Join Bossjob to accelerate your professional career today! Access courses and job opportunities in ${getCountry()}. Network of 2 million+ professionals.`
    }
  }
}
export default QuickUploadResume
