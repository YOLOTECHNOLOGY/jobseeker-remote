'use client'
import React, { useState, useEffect, useContext } from 'react'
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
import { languageContext } from 'app/components/providers/languageProvider'
import { getAlertData } from './getAlertData'

const JobAlert = (props: any) => {
  const accessToken = getCookie('accessToken')
  const userCookie = getCookie('user')
  const router = useRouter()
  const { searchValues, config } = props
  const params = buildParams(config, searchValues)
  const { query, location } = params
  const [createdJobAlert, setCreatedJobAlert] = useState(null)
  const dispatch = useDispatch()
  const { search } = useContext(languageContext) as any

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
    const data = getAlertData(searchValues, config)
    const createJobAlertPayload = {
      email: email,
      frequency_id: 1,
      keyword: params?.query ? params.query : '',
      is_company_verified: (params.is_company_verified ? '1' : undefined) ?? 'all',
      ...data
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
      <div className={styles.jobListOptionAlertsMain}>
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
          <Text textStyle='base'>{search.alert}</Text>
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
      </div>
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
