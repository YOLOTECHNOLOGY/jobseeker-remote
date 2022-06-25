import React from 'react'
import { NextPage } from 'next'

/* Components */
import Text from 'components/Text'
import Layout from 'components/Layout'

/* Styles */
import styles from 'styles/maintenance.module.scss'

// Images
import {
  Maintenance
} from 'images'

const MaintenancePage: NextPage = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <img src={Maintenance} />
        <Text textStyle='xxxl' bold className={styles.title}>
          We are under maintenance.
        </Text>
        <Text textStyle='lg' className={styles.subTitle}>The page that you are looking for is currently under maintenance and will be back soon!</Text>
      </div>
    </Layout>
  )
}

export default MaintenancePage
