import React from 'react'
import styles from './index.module.scss'
import Empty from '../Empty'
import List from './List'
interface IProps {
  lang: any
}

const ShieldingCompany = (props: IProps) => {
  const { lang } = props

  return (
    <div className={styles.main}>
      <div className={styles.mainNav}>
        <div className={styles.mainTitle}>Shielding Company</div>
        <div className={styles.mainAdd}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='26'
            height='27'
            viewBox='0 0 26 27'
            fill='none'
          >
            <circle cx='12.9998' cy='13.2694' r='9.48029' fill='#2378E5' />
            <path
              d='M7.5 13.456H18.5M12.958 7.76953V18.7695'
              stroke='white'
              strokeWidth='1.5'
              strokeLinecap='round'
            />
          </svg>
        </div>
      </div>

      <div className={styles.mainContent}>
        <List />
        {/* <Empty style={{ marginTop: '80px' }} lang={lang} /> */}
      </div>
    </div>
  )
}

export default ShieldingCompany
