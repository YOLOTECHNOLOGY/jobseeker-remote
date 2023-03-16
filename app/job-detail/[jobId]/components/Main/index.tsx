import Desc from './Desc/Desc'
import Benefits from './Benefits/Benefits'

import styles from '../../page.module.scss'

const MainFC = () => {
  return (
    <main className={styles.main}>
      <Desc />
      <Benefits />
    </main>
  )
}

export default MainFC
