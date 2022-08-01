import React from 'react'

/* Action Creators */
import { wrapper } from 'store'

// @ts-ignore
import { END } from 'redux-saga'

// Components
import Layout from 'components/Layout'
import Text from 'components/Text'

// Redux Actions
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'

// Styles
import styles from './ApplySuccess.module.scss'
import { fetchJobDetailRequest } from 'store/actions/jobs/fetchJobDetail'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'

const ApplySuccess = () => {
  return (
    <Layout>
      <div className={styles.companies}>
        <div className={styles.featuredEmployer}>
          
        </div>

        <Text textStyle='xxl' tagName='h2' bold className={styles.featuredEmployerSectionTitle}>
          Here are some relevant jobs you might want to apply too!
        </Text>
      </div>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query, req }) => {
  const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null
  const { keyword } = query
  const keywordQuery: any = keyword
  const jobId = keywordQuery?.split('-').pop()
  
  store.dispatch(fetchJobDetailRequest({
      jobId,
      status: 'protected',
      serverAccessToken: accessToken,
    })
  )
  store.dispatch(fetchUserOwnDetailRequest({accessToken}))
  store.dispatch(fetchConfigRequest())
  store.dispatch(END)
  
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const jobDetail = storeState.job?.jobDetail.response
  const userDetail = storeState.users?.fetchUserOwnDetail.response
  
  // Redirect to job page if the job hasn't been applied by the user
  if (!jobDetail.is_applied) {
    return {
      redirect: {
        permanent: false,
        destination: jobDetail.job_url
      }
    }
  }

  return {
    props: {
      jobDetail: jobDetail,
      userDetail: userDetail,
    }
  }
})

export default ApplySuccess