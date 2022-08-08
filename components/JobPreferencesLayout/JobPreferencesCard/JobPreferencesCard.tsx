import { useState } from 'react'

/* Vendors */
import { useSelector } from 'react-redux'

/* Components */
import Text from '../../Text'
import MaterialButton from 'components/MaterialButton'
import ModalJobPreferences from 'components/ModalJobPreferences'

/* Helpers */
import { getNoticePeriodList } from 'helpers/jobPayloadFormatter'

/* Images */
import { PencilIcon } from 'images'

/* Styles */
import styles from './JobPreferencesCard.module.scss'

type JobPreferencesCardProps = {
  title: string
  modalName: string
  showModal: boolean
  // workingSetting: string
  userDetail: any
  config: any
  handleModal: Function
}

const JobPreferencesCard = ({
  title,
  modalName,
  showModal,
  // workingSetting,
  userDetail,
  config,
  handleModal
}: JobPreferencesCardProps) => {
  console.log('userDetail', userDetail)

  const noticeList = getNoticePeriodList(config)

  const getAvailability = (userDetail) => {
    const checkNoticePeriod = notice => userDetail.notice_period_id === notice.value
    const findAvailability = noticeList.find(checkNoticePeriod).label

    return findAvailability
  }

  const truncateSalary = (userDetail) => {
    let minSalary = userDetail.job_preference.salary_range_from
    let maxSalary = userDetail.job_preference.salary_range_to

    const minCharIndex = minSalary.indexOf('.')
    const maxCharIndex = maxSalary.indexOf('.')

    // To truncate ".00"
    minSalary = minSalary.substring(0, minCharIndex != -1 ? minCharIndex : minSalary.length)
    maxSalary = maxSalary.substring(0, maxCharIndex != -1 ? maxCharIndex : maxSalary.length)

    // To add ','
    minSalary = `${minSalary.slice(0, -3)},${minSalary.slice(-3, minSalary.length)}`
    maxSalary = `${maxSalary.slice(0, -3)},${maxSalary.slice(-3, maxSalary.length)}`

    const salaryRange = { minSalary, maxSalary }
    return salaryRange
  }

  const handleEditClick = () => {
    handleModal(modalName, true)
  }

  return (
    <div className={styles.JobPreferencesCard}>
      <div className={styles.JobPreferencesCardEditIcon} onClick={handleEditClick}>
        <img src={PencilIcon} width='24' height='24' />
      </div>
      <div>
        <Text bold textColor='primaryBlue' textStyle='xl'>
          {title}
        </Text>
      </div>
      <div>
        <Text tagName='p' textStyle='lg'>
          We will find jobs that are of a good match to you based on your job preferences.
        </Text>
      </div>
      <div className={styles.JobPreferencesCardDetail}>
          {!userDetail.job_preference.job_title && !userDetail.job_preference.job_type && 
            !userDetail.job_preference.salary_range_from && !userDetail.job_preference.location && 
            !userDetail.notice_period_id ? (
              <MaterialButton
                className={styles.JobPreferencesCardButton}
                variant='outlined'
                capitalize={false}
                size='large'
                onClick={handleEditClick}
                style={{ textTransform: 'none', fontSize: '16px', height: '44px' }}
              >
                Add job preferences
              </MaterialButton>
            ) : (
              <ul className={styles.JobPreferencesCardDetailList}>
                {userDetail.job_preference.job_title && (
                  <li style={{ marginTop: '8px' }}>
                    <Text textColor='lightgrey'>Desire job title:</Text>
                    <Text className={styles.JobPreferencesCardDetailText}>{userDetail.job_preference.job_title}</Text>
                  </li>
                )}
                {userDetail.job_preference.job_type && (
                  <li>
                    <Text textColor='lightgrey'>Desire job type:</Text>
                    <Text className={styles.JobPreferencesCardDetailText}>{userDetail.job_preference.job_type}</Text>
                  </li>
                )}
                {userDetail.job_preference.salary_range_from && (
                  <li>
                      <Text textColor='lightgrey'>Expected salary:</Text>
                      <Text className={styles.JobPreferencesCardDetailText}>
                        P{truncateSalary(userDetail).minSalary} - P{truncateSalary(userDetail).maxSalary}
                      </Text>
                  </li>
                )}
                {userDetail.job_preference.location && (
                  <li>
                      <Text textColor='lightgrey'>Desire working location:</Text>
                      <Text className={styles.JobPreferencesCardDetailText}>{userDetail.job_preference.location}</Text>
                  </li>
                )}
                {/* {workingSetting && (
                  <li>
                      <Text textColor='lightgrey'>Desire working setting:</Text>
                      <Text>{workingSetting}</Text>
                  </li>
                )} */}
                {userDetail.notice_period_id && (
                  <li>
                      <Text textColor='lightgrey'>Availability:</Text>
                      <Text className={styles.JobPreferencesCardDetailText}>{getAvailability(userDetail)}</Text>
                  </li>
                )}
              </ul>
            )
          }
      </div>
      <ModalJobPreferences 
        modalName={modalName}
        showModal={showModal}
        config={config}
        userDetail={userDetail}
        handleModal={handleModal}
      />
    </div>
  )
}

export default JobPreferencesCard