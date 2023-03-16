import { Desc, Benefits } from './index'

import styles from '../../page.module.scss'

const Main = () => {
  return (
    <main className={styles.main}>
      <Desc />
      <Benefits />
    </main>
  )
}

export default Main
