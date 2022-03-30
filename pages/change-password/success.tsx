// Components
import Layout from 'components/Layout'
import Text from 'components/Text'

// Styles
import styles from './ChangePassword.module.scss'

const ChangePasswordSuccess = () => {
  return (
    <Layout>
      <div className={styles.ChangePasswordSuccess}>
        <Text textStyle='xl' bold textColor='primaryBlue'>Password Changed</Text>
      </div>
    </Layout>
  )
}

export default ChangePasswordSuccess