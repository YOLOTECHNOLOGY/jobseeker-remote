import React from 'react'
import { NextPage } from 'next'

/* Components */
import Text from 'components/Text'
import Link from 'components/Link'
import Layout from 'components/Layout'
import MaterialButton from 'components/MaterialButton'

/* Styles */
import styles from 'styles/404.module.scss'

// Images
import {
  NotFound404
} from 'images'

const Custom404Page: NextPage = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <img src={NotFound404} />
        <Text textStyle='xxxl' bold className={styles.title}>
          Page not found.
        </Text>
        <Text textStyle='lg'>The page that you are looking for cannot be found.</Text>
        <MaterialButton variant='contained' capitalize>
          <Link
            to='/jobs-hiring/job-search'
          >
            <Text textStyle='lg' bold textColor='white'>Back to job search</Text>
          </Link>
        </MaterialButton>
      </div>
    </Layout>
  )
}

export default Custom404Page
