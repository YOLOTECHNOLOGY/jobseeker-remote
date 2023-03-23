import GoogleMap from 'components/GoogleMap/GoogleMap'
import styles from '../../../page.module.scss'

export type propsType = {
  lat: number
  lng: number
  full_address: string
}

const Map = ({ lat, lng, full_address }: propsType) => {
  return (
    <section className={styles.map}>
      <h5>Working Location</h5>
      <p>{full_address}</p>

      {lat && lng && (
        <div className={styles.map_context}>
          <GoogleMap lat={Number(lat)} lng={Number(lng)} />
        </div>
      )}
    </section>
  )
}

export default Map
