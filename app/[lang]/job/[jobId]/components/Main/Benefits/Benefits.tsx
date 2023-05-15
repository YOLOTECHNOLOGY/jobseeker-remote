import styles from '../../../page.module.scss'

export type propsType = {
  benefits?: Array<any>
}

const Benefits = ({ benefits }: propsType) => {
  return (
    <section className={styles.benefits}>
      <h2>Benefits</h2>

      <div className={styles.benefits_labels}>
        {benefits?.map((benefit) => (
          <div key={benefit.id}>{benefit?.name}</div>
        ))}
      </div>
      {/* <div className={styles.benefits_more}>See more</div> */}
    </section>
  )
}

export default Benefits
