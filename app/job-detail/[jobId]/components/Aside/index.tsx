import { cookies } from 'next/headers'

import Company, { propsType } from './Company/Company'
import SignUp from './SignUp/SignUp'
import SimilarJobs from './SimilarJobs/SimilarJobs'
import AdSlot from 'app/components/AdSlot'

import styles from '../../page.module.scss'

type propsT = propsType & { jobDetail: any }

const AsideFC = (props: propsT) => {
  const cookieStore = cookies()
  const token = cookieStore.get('accessToken')
  return (
    <aside className={styles.aside}>
      {!token && <SignUp jobId={props.jobId} />}

      <Company {...props} />

      {/* @ts-expect-error Async Server Component */}
      <SimilarJobs id={props.jobId} jobDetail={props.jobDetail} />

      <div className={styles.ad_container}>
        <AdSlot adSlot={'job-detail/square-banner-1'} />
      </div>
    </aside>
  )
}

export default AsideFC
