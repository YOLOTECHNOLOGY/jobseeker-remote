/* Components */
import Layout from 'components/Layout'
import Text from 'components/Text'
import SEO from 'components/SEO'

/* Styles */
import styles from './Job.module.scss'

const Job = () => {
  return (
    <Layout>
      <SEO title={'seoMetaTitle'} description={'seoMetaDescription'} />
      <div className={styles.Job}>
        <Text textStyle='lg'>Job Detail Page</Text>
      </div>
    </Layout>
  )
}

export default Job