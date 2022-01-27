import classNames from 'classnames'

/* Styles */
import styles from '../SocialMediaAuth.module.scss'

/* Images */
import { FacebookLogo } from 'images'

interface IFacebook {
  className?: string
}

const Facebook = ({
  className
}: IFacebook) => {
  return (
    <div className={classNames(className, styles.ButtonWrapper, styles.FacebookButton)}>
      <img
        src={FacebookLogo}
          width={9}
          height={16}
        title="Login via Facebook"
        alt="Login via Facebook"
      />
    </div>
  )
}

export default Facebook