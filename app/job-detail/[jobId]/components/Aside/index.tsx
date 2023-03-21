import { cookies } from 'next/headers'

import Company, { propsType } from './Company/Company'
import SignUp from './SignUp/SignUp'
import SimilarJobs from './SimilarJobs/SimilarJobs'
import AdSlot from 'app/components/AdSlot'

import styles from '../../page.module.scss'

const AsideFC = (company: propsType) => {
  const cookieStore = cookies()
  const token = cookieStore.get('accessToken')
  return (
    <aside className={styles.aside}>
      {!token && <SignUp jobId={company.jobId} />}

      <Company {...company} />

      {/* @ts-expect-error Async Server Component */}
      <SimilarJobs id={company.jobId} />

      <div className={styles.ad_container}>
        <AdSlot adSlot={'job-detail/square-banner-1'} />
      </div>
    </aside>
  )
}

export default AsideFC
