import React from 'react'
import Text from 'components/Text'
import { BossjobLogo, increaseUserConversionModelBg } from 'images'
import QuickLayout from '../quickLayout'
import UploadResume from '../components/UploadResume'
import RegisterInfo from '../components/RegisterInfo'

import LinearProgress from '@mui/material/LinearProgress'

import useRegister from 'pages/hooks/useRegister'
import useFakeUploadResume from 'pages/hooks/useFakeUploadResume'

import styles from './styles.module.scss'

const QuickUploadResume = () => {
  const UseHooksRegister = useRegister()
  const useHooksFakeUploadResume = useFakeUploadResume()
  const { isRegisteringJobseeker, isLoading, isShowRegisterInfo } = UseHooksRegister

  return (
    <QuickLayout>
      <div className={styles.AuthLayout}>
        <div className={styles.AuthLayoutBody}>
          <div className={styles.wrapper}>
            <div className={styles.loadingWrapper}></div>
          </div>
          <div className={styles.AuthWrapper}>
            <div className={styles.AuthWrapperImage}>
              <div className={styles.AuthWrapperImageTitle}>
                <Text textColor='white' textStyle='xxxl' block bold>
                  Chat with Boss
                </Text>
                <Text textColor='white' textStyle='xxxl' block bold>
                  to get your
                </Text>
                <Text textColor='white' textStyle='xxxl' block bold>
                  next offer!
                </Text>
              </div>
              <div className={styles.AuthWrapperImageContext}>
                <img src={increaseUserConversionModelBg} />
              </div>
            </div>
            <div className={styles.AuthWrapperInfo}>
              {isLoading | isRegisteringJobseeker ? (
                <div className={styles.AuthWrapperLoading}>
                  <div className={styles.loadingLogo}>
                    <img src={BossjobLogo} title='Bossjob logo' alt='Bossjob logo' />
                  </div>
                  <div className={styles.loadingIndicator}>
                    <LinearProgress />
                  </div>
                  <Text textStyle='sm'>Please hold on while we are parsing your resume.</Text>
                </div>
              ) : null}

              {isShowRegisterInfo() ? (
                <RegisterInfo {...UseHooksRegister} />
              ) : (
                <UploadResume {...useHooksFakeUploadResume} />
              )}
            </div>
          </div>
        </div>
      </div>
    </QuickLayout>
  )
}

export default QuickUploadResume
