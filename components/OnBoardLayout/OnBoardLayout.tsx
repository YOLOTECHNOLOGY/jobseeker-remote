// Vendors
import classNames from 'classnames/bind'

// Components
import Link from 'components/Link'
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'

// Images
import { BossjobLogo } from 'images'

// Styles
import styles from './OnBoardLayout.module.scss'

interface IOnBoardLayout {
  headingText: React.ReactNode
  currentStep: number
  totalStep: number | 4
  children:  React.ReactNode
  backFnBtn?: Function
  nextFnBtn?: Function,
  isUpdating?: boolean,
  isNextDisabled?: boolean,
  isMobile?: boolean
}

const OnBoardLayout = ({
  headingText,
  currentStep,
  totalStep,
  children,
  backFnBtn,
  nextFnBtn,
  isUpdating,
  isNextDisabled,
  isMobile = false
}: IOnBoardLayout) => {
  const componentClass = {
    ['is-disabled']: isNextDisabled,
  }

  const cx = classNames.bind(styles)
  const buttonClass = cx([componentClass])
  
  return (
    <div className={styles.OnBoardLayout}>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1' />
      </head>
      <div className={styles.OnBoardLayoutHeader}>
        <Link title='Home' to='/jobs-hiring/job-search'>
          <img id={styles.logo} src={BossjobLogo} title='Bossjob logo' alt='Bossjob logo' />
        </Link>
      </div>
      <div className={styles.OnBoardLayoutBody}>
        <div className={styles.OnBoardLayoutContent}>
          <div className={styles.OnBoardWrapper}>
            <div className={styles.OnBoardHeading}>
              {headingText}
            </div>
            <div className={styles.OnBoardMultistep}>
              <Text 
                textStyle='base' 
                textColor='darkgrey'
              >
                Page {currentStep} of {totalStep}
              </Text>
            </div>
            <div className={styles.OnBoardContent}>
              {children}
            </div>
          </div>
          <div className={styles.OnBoardLayoutFooter}>
            <div>
              {backFnBtn && !isMobile && (
                <MaterialButton variant='outlined' capitalize onClick={() => backFnBtn()}>
                  <Text textColor='primary' bold>Back</Text>
                </MaterialButton>
              )}
            </div>
            <div>
              {nextFnBtn && !isMobile && (
                <MaterialButton 
                  isLoading={isUpdating} 
                  variant='contained' 
                  capitalize 
                  onClick={() => nextFnBtn()} 
                  disabled={isNextDisabled}
                  className={classNames([buttonClass])}
                >
                  <Text textColor='white' bold>Next</Text>
                </MaterialButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnBoardLayout