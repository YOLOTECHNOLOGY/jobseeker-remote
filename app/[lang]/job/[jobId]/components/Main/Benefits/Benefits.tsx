import React from 'react'
import styles from '../../../page.module.scss'

export type propsType = {
  benefits?: Array<any>
  lang:Record<string, any>
}

const Benefits = ({ benefits,lang }: propsType) => {
  return (
    <section className={styles.benefits}>
      <h2>{lang?.benefits}</h2>

      <div className={styles.benefits_labels}>
        {benefits?.map((benefit) => (
          <div key={benefit.id}>{benefit}</div>
        ))}
      </div>
      {/* <div className={styles.benefits_more}>See more</div> */}
    </section>
  )
}

export default Benefits
