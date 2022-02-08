// Components
import Link from 'components/Link'
import Text from 'components/Text'
import Button from 'components/Button'

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
  nextFnBtn?: Function
}

const OnBoardLayout = ({
  headingText,
  currentStep,
  totalStep,
  children,
  backFnBtn,
  nextFnBtn,
}: IOnBoardLayout) => {
  return (
    <div className={styles.OnBoardLayout}>
      <div className={styles.OnBoardLayoutHeader}>
        <Link title='Home' to={'/'}>
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
              {backFnBtn && (
                <Button secondary onClick={() => backFnBtn()}>
                  <Text textColor='primary' bold>Back</Text>
                </Button>
              )}
            </div>
            <div>
              {nextFnBtn && (
                <Button primary onClick={() => nextFnBtn()}>
                  <Text textColor='white' bold>Next</Text>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnBoardLayout