import styles from '../../../page.module.scss'

const Map = () => {
  return (
    <section className={styles.map}>
      <h5>Working Location</h5>
      <p>111 Paseo de Roxas Building Legazpi Village, Makati City, Philippines</p>
      <div className={styles.map_context}></div>
    </section>
  )
}

export default Map
