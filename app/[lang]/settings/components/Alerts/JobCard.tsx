import React, { useCallback } from 'react'
import Image from 'next/image'

import { getValueById } from 'helpers/config/getValueById'
import { AccountSettingDeleteIconBin, AccountSettingEditIconPen } from 'images'

import styles from './index.module.scss'

interface IProps {
  lang: {[Key:string]: any}
  item: {[Key:string]: any}
  config: {[Key:string]: any}
  filterValues: string
  handleEditJobAlert: (item: any) => void
  handleDeleteJobAlert: (item: any) => void
}

const JobCard = (props: IProps) => {
  const { lang, item, config, filterValues, handleEditJobAlert, handleDeleteJobAlert } = props

  const { accountSetting } = lang

  const frequencyValue = useCallback(
    (item) => {
      return (
        getValueById(config, item?.frequency_id, 'subscibe_job_frequency_id') ||
        item?.frequency_value
      )
    },
    [config]
  )

  return (
    <div className={styles.JobAlertContainer_item}>
      <div className={styles.JobAlertContainer_desc}>
        <div className={styles.JobAlertContainer_left}>
          {accountSetting.filter}:
          <div className={styles.JobAlertContainer_filter} title={filterValues}>
            {filterValues}
          </div>
        </div>
        <div className={styles.JobAlertContainer_right}>
          <Image
            src={AccountSettingEditIconPen}
            onClick={() => handleEditJobAlert(item)}
            width={14}
            height={16}
            alt='edit'
          ></Image>
          <Image
            src={AccountSettingDeleteIconBin}
            onClick={() => handleDeleteJobAlert(item)}
            width={14}
            height={16}
            alt='delete'
          ></Image>
        </div>
      </div>
      <div className={styles.JobAlertContainer_desc}>
        {accountSetting.frequency}: {frequencyValue(item)}
      </div>
      <div className={styles.JobAlertContainer_desc}>
        {accountSetting.email}: {item.email}
      </div>
    </div>
  )
}

export default React.memo(JobCard)
