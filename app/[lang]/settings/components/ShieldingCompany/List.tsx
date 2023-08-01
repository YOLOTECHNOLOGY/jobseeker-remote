import React from 'react'
import styles from './index.module.scss'

interface IProps {
  handleClick: Function
  list: Array<any>
  lang: any
}

const List = (props: IProps) => {
  const { handleClick, list, lang } = props
  const { accountSetting } = lang

  return (
    <div className={styles.companyList}>
      {list.map((item) => {
        return (
          <div className={styles.companyItem} key={item?.id}>
            <div className={styles.companyItemTitle}>{item?.company?.name}</div>
            <div className={styles.companyItemAction} onClick={() => handleClick(item)}>
              {accountSetting?.blockMessages?.unblock}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default List
