import React from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@mui/material'
import Text from 'components/Text'

import styles from './index.module.scss'


interface IProps {
  lang: any
}

const Empty = (props: IProps) => {

  const { lang } = props
  const { accountSetting } = lang
  
  const router = useRouter()

  const handelBackToJobSearch = () => {
    router.push('/jobs-hiring/job-search')
  }

  return (
    <div className={styles.JobAlertContainer_noJobAlert}>
    <Text block>{accountSetting.notJobAlert} </Text>
    <Button
      variant='contained'
      onClick={() => {
        handelBackToJobSearch()
      }}
      className={styles.JobAlertContainer_noJobAlert_backBtn}
    >
      {accountSetting.toSearch}
    </Button>
  </div>
  )
}

export default React.memo(Empty)