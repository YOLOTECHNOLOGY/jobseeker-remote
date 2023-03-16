import { SignUp, Company, SimilarJobs } from '.'

import styles from '../../page.module.scss'

const Aside = () => {
  return (
    <aside className={styles.aside}>
      <SignUp />
      <Company />
      <SimilarJobs />
    </aside>
  )
}

export default Aside
