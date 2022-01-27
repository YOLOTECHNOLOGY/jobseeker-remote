/* Vendors */
import { useRouter } from 'next/router'

/* Components */
import Google from './Google'
import Facebook from './Facebook'
import Linkedin from './Linkedin'

/* Styles */
import styles from './SocialMediaAuth.module.scss'

interface ISocialMediaAuth {
  callbackRequest: Function
}

const SocialMediaAuth = ({
  callbackRequest,
}: ISocialMediaAuth) => {
  const router = useRouter()

  return (
    <div className={styles.SocialButtonWrapper}>
      <Google
        className={styles.SocialButton}
        callBackMethod={callbackRequest}
        redirect={router.query.redirect}
        isLogin
      />
      <Linkedin
        className={styles.SocialButton}
      />
      <Facebook
        className={styles.SocialButton}
      />
    </div>
  )
}

export default SocialMediaAuth