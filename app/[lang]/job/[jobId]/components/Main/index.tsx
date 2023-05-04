import Desc from './Desc/Desc'
import Benefits from './Benefits/Benefits'
import Map from './Map/Map'
import Search from './Search/Search'

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
  shareParams: any
  lat: number
  lng: number
  full_address: string
  published_at: string
  recruiter: any
  languages: Record<string, any>
}

const MainFC = (props: propsType) => {
  const { content } = props.languages
  return (
    <main className={styles.main}>
      <Desc {...props} />
      {props.benefitsProps?.length ? <Benefits benefits={props.benefitsProps} /> : null}
      <Map lat={props.lat} lng={props.lng} full_address={props.full_address} />
      <Search />

      <span className={styles.published_at}>
        {content.jobPostedOn} {props.published_at}
      </span>
    </main>
  )
}

export default MainFC
