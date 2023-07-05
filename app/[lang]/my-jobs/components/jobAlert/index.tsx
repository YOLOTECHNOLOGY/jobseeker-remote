'use client'
import React, { useState, useEffect } from 'react'
import ModalJobAlerts from 'components/ModalJobAlerts'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobAlertsListRequest } from 'store/actions/alerts/fetchJobAlertsList'
import { deleteJobAlertRequest } from 'store/actions/alerts/deleteJobAlert'
import { updateJobAlertRequest } from 'store/actions/alerts/updateJobAlert'
import { getCookie } from 'helpers/cookies'
import { createJobAlertRequest } from 'store/actions/alerts/createJobAlert'
import Text from 'components/Text'
import styles from './index.module.scss'
import { useRouter } from 'next/navigation'
import { buildParams } from 'app/(jobs-hiring)/[lang]/jobs-hiring/interpreters/encoder'
import { BellIcon } from 'images'
import { openManageJobAlertsModal } from 'store/actions/modals/manageJobAlertsModal'

const JobAlert = (props: any) => {
  const accessToken = getCookie('accessToken')
  const userCookie = getCookie('user')
  const router = useRouter()
  const { searchValues, config } = props
  const salaryList = config.salary_range_filters ?? []
  const salaryValues = (searchValues.salary ?? [])
    .map((item) => salaryList.find((salary) => salary['seo-value'] === item).value)
    .join(',')
  const params = buildParams(config, searchValues)
  const { query, location } = params
  const [createdJobAlert, setCreatedJobAlert] = useState(null)
  const dispatch = useDispatch()
  const createdJobAlertResponse = useSelector((store: any) => store.alerts.createJobAlert)
  const isCreatingJobAlert = useSelector((store: any) => store.alerts.createJobAlert.fetching)
  const jobAlertListResponse = useSelector((store: any) => store.alerts.fetchJobAlertsList.response)
  const [jobAlertList, setJobAlertList] = useState(null)
  useEffect(() => {
    if (jobAlertListResponse) setJobAlertList(jobAlertListResponse)
    if (createdJobAlertResponse) setCreatedJobAlert(createdJobAlertResponse)
  }, [jobAlertListResponse, createdJobAlertResponse])
  const isDeletingJobAlert = useSelector((store: any) => store.alerts.deleteJobAlert.fetching)
  const isUpdatingJobAlert = useSelector((store: any) => store.alerts.updateJobAlert.fetching)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
  useEffect(() => {
    setIsUserAuthenticated(accessToken ? true : false)
  }, [])
  const handleFetchJobAlertsList = () => dispatch(fetchJobAlertsListRequest({ accessToken }))
  const handleDeleteJobAlert = (jobAlertId) => {
    const deleteJobAlertPayload = {
      jobAlertId,
      accessToken
    }

    dispatch(deleteJobAlertRequest(deleteJobAlertPayload))
  }
  const handleUpdateJobAlert = (updateJobAlertData) => {
    const updateJobAlertPayload = {
      updateJobAlertData,
      accessToken
    }

    dispatch(updateJobAlertRequest(updateJobAlertPayload))
  }
  const handleCreateJobAlertData = (email) => {
    const createJobAlertPayload = {
      email: email,
      keyword: params?.query ? params.query : '',
      location_values: params?.job_locations ? params.job_locations : 'all',
      job_type_values: params?.job_types ? params.job_types : 'all',
      salary_range_values: salaryValues ? salaryValues : 'all',
      xp_lvl_values: params?.xp_lvls ? params.xp_lvls : 'all',
      degree_values: params?.qualification ? params.qualification : 'all',
      main_functions: params?.main_functions ?? 'all',
      job_functions: params?.job_function_ids ?? 'all',
      function_titles: params?.function_job_title_ids ?? 'all',
      is_company_verified: 'all',
      frequency_id: 1
    }
    createJobAlert(createJobAlertPayload)
  }

  const handleCreateJobAlert = (email?: any) => {
    handleCreateJobAlertData(email)
  }
  const createJobAlert = (jobAlertData) => {
    const createJobAlertPayload = {
      jobAlertData,
      accessToken,
      user_id: userCookie.id
    }
    dispatch(createJobAlertRequest(createJobAlertPayload))
  }
  return (
    <div className={styles.jobListOptionAlerts}>
      <div
        className={styles.jobListOptionAlertsItem}
        onClick={() => {
          if (isUserAuthenticated) handleCreateJobAlert()
          else {
            const lastSearch = sessionStorage.getItem('search-job-last-keyword')
            if (lastSearch) {
              sessionStorage.setItem('should-show-alert', '1')
            }
            router.push('/get-started?redirect=/jobs-hiring/job-search')
          }
        }}
      >
        <Text textStyle='base'>{isUserAuthenticated} Enable job alert</Text>
      </div>
      {isUserAuthenticated && (
        <div
          className={styles.jobListOptionAlertsItem}
          onClick={() => {
            dispatch(openManageJobAlertsModal() as any)
          }}
        >
          <img src={BellIcon} width='20' height='20' />
        </div>
      )}
      <ModalJobAlerts
        query={query}
        location={location}
        jobAlertsList={jobAlertList}
        createdJobAlert={createdJobAlert}
        handleFetchJobAlertsList={handleFetchJobAlertsList}
        handleDeleteJobAlert={handleDeleteJobAlert}
        handleUpdateJobAlert={handleUpdateJobAlert}
        handleCreateJobAlert={handleCreateJobAlertData}
        isUpdatingJobAlert={isUpdatingJobAlert}
        isDeletingJobAlert={isDeletingJobAlert}
        isCreatingJobAlert={isCreatingJobAlert}
        isPublicPostReportJob={!isUserAuthenticated}
      />
    </div>
  )
}
export default JobAlert
