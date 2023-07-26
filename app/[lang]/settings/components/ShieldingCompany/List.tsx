import React from 'react'
import styles from './index.module.scss'

const List = ({ handleClick, list }) => {
  return (
    <div className={styles.companyList}>
      <div className={styles.companyItem}>
        <div className={styles.companyItemTitle}>Shielding Company 123</div>
        <div className={styles.companyItemAction} onClick={() => handleClick('id')}>
          Unblock
        </div>
      </div>
      <div className={styles.companyItem}>
        <div className={styles.companyItemTitle}>Shielding Company 456</div>
        <div className={styles.companyItemAction}>Unblock</div>
      </div>
      <div className={styles.companyItem}>
        <div className={styles.companyItemTitle}>Shielding Company 789</div>
        <div className={styles.companyItemAction}>Unblock</div>
      </div>
    </div>
  )
}

export default List
