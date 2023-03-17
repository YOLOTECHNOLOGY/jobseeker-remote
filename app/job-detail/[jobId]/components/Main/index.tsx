import Desc from './Desc/Desc'
import Benefits from './Benefits/Benefits'

import styles from '../../page.module.scss'

type propsType = {
  description: string
  requirements: string
  skills: Array<any>
  logo: string
  name: string
  chatResponseRate: number
  lastActiveAt: string
  benefitsProps: Array<any>
}

const MainFC = (props: propsType) => {
  return (
    <main className={styles.main}>
      <Desc {...props} />
      <Benefits benefits={props.benefitsProps} />
    </main>
  )
}

export default MainFC
