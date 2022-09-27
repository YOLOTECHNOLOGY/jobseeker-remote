import Layout from 'components/Layout'
import SEO from 'components/SEO'
// import EmailLogin from 'components/GetStarted/EmailLogin/EmailLogin'
import SendTOP from 'components/GetStarted/SendTOP/SendTOP'
// import Text from 'components/Text'
// import Link from 'components/Link'

import styles from './index.module.scss'

const GetStarted = () => {
  return (
    <Layout isHiddenFooter>
      <SEO
        title='Sign Up | Bossjob'
        description='Join Bossjob to accelerate your professional career today! Access courses and job opportunities in Philippines. Network of 2 million+ professionals.'
        canonical='/register/jobseeker'
      />
      <div className={styles.Container}>
        <div>
          <div className={styles.getStartedContainer}>
            {/* <EmailLogin /> */}
            <SendTOP />
          </div>
          <div className={styles.ToEmployer}>
            {/* <Text tagName='p' textStyle='base' className={styles.ToEmployer_textColor}>
              Looking to hire people? Sign up as
              <Link
                to={`${process.env.OLD_PROJECT_URL}/login`}
                className={styles.AuthCTALink}
                aTag
                external
              >
                <Text textColor='primaryBlue'> Employer</Text>
              </Link>
            </Text> */}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default GetStarted
