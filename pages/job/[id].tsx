/* Components */
import Layout from 'components/Layout'
import Text from 'components/Text'

/* Styles */
import styles from './job.module.scss'

const Job = () => {
  return (
    <Layout>
      <div className={styles.job}>
        <div className={styles.jobList}></div>
        <div className={styles.jobDetail}>
          <div className={styles.jobDetailHeader}>
            <div className={styles.jobDetailImage}></div>
            <div className={styles.jobDetailInfo}>
              <Text textStyle='xl' bold>Operation Manager lorem ipsum dolor sit amet lorem ipsum dolor sit amet</Text>
              <Text textStyle='base'>Loop Contact Solutions Inc.</Text>
            </div>
          </div>
        </div>
        <div className={styles.jobAds}></div>
      </div>
    </Layout>
  )
}

export default Job