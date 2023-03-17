import Company, { propsType } from './Company/Company'
import SignUp from './SignUp/SignUp'
import SimilarJobs from './SimilarJobs/SimilarJobs'
import AdSlot from 'app/components/AdSlot'

import styles from '../../page.module.scss'

const AsideFC = (company: propsType) => {
  return (
    <aside className={styles.aside}>
      <SignUp />
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
