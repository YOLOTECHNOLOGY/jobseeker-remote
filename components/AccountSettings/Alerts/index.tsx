import FieldFormWrapper from '../FieldFormWrapper'
import Text from 'components/Text'
import styles from './index.module.scss'

import { fetchJobAlertsListRequest } from 'store/actions/alerts/fetchJobAlertsList'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

const Alerts = ({ accessToken }: any) => {
  const dispatch = useDispatch()
  const jobAlertListResponse = useSelector((store: any) => store.alerts.fetchJobAlertsList.response)

  useEffect(() => {
    dispatch(fetchJobAlertsListRequest({ accessToken }))
  }, [])

  // useEffect(() => {
  //   console.log(jobAlertListResponse, '--=')
  // }, [jobAlertListResponse])

  return (
    <div className={styles.JobAlertContainer}>
      {jobAlertListResponse.length &&
        jobAlertListResponse.map((item) => (
          <FieldFormWrapper label='All jobs' isEdit isDetele key={item.id}>
            <Text block className={styles.JobAlertContainer_title}>
              {item.keyword_value}
            </Text>
            <Text block className={styles.JobAlertContainer_desc}>
              Filters: {item.filters}
            </Text>
            <Text block className={styles.JobAlertContainer_desc}>
              Frequency: {item.frequency_value}
            </Text>
            {/* {edit === 'Password' && ()} */}
          </FieldFormWrapper>
        ))}
    </div>
  )
}

export default Alerts
