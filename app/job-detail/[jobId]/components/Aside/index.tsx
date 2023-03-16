import Company, { propsType } from './Company/Company'
import SignUp from './SignUp/SignUp'
import SimilarJobs from './SimilarJobs/SimilarJobs'

import styles from '../../page.module.scss'

const AsideFC = (company: propsType) => {
  return (
    <aside className={styles.aside}>
      <SignUp />
      <Company {...company} />
      {/* @ts-expect-error Async Server Component */}
      <SimilarJobs id={company.jobId} />
    </aside>
  )
}

export default AsideFC
