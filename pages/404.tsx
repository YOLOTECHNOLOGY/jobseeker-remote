import React from 'react'
import { NextPage } from 'next'

/* Components */
import Text from 'components/Text'
import Link from 'components/Link'
import Layout from 'components/Layout'

/* Styles */
import styles from 'styles/404.module.scss'

const Custom404Page: NextPage = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <Text textStyle='xxxl' bold className={styles.title}>
          404 Error
        </Text>
        <Text textStyle='lg'>We can't find the page you are looking for.</Text>
        <Link
          to='/'
        >
          Home
        </Link>
      </div>
    </Layout>
  )
}

export default Custom404Page
