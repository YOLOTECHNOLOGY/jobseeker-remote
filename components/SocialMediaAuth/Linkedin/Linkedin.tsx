import classNames from 'classnames'

/* Styles */
import styles from '../SocialMediaAuth.module.scss'

/* Images */
import { LinkedinLogo } from 'images'

interface ILinkedin {
  className?: string
}

const Linkedin = ({
  className
}: ILinkedin) => {
  return (
    <div className={classNames(className, styles.ButtonWrapper, styles.LinkedinButton)}>
      <img
        src={LinkedinLogo}
        width={16}
        height={16}
        title="Login via Linkedin"
        alt="Login via Linkedin"
      />
    </div>
  )
}

export default Linkedin