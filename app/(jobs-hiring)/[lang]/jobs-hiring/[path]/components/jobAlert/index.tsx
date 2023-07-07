'use client'
import React, { useState, useEffect, useContext, useMemo } from 'react'
// import ModalJobAlerts from 'components/ModalJobAlerts'
import { useDispatch } from 'react-redux'

// import { fetchJobAlertsListRequest } from 'store/actions/alerts/fetchJobAlertsList'
// import { deleteJobAlertRequest } from 'store/actions/alerts/deleteJobAlert'
// import { updateJobAlertRequest } from 'store/actions/alerts/updateJobAlert'
// import { createJobAlertRequest } from 'store/actions/alerts/createJobAlert'

import { createJobAlertService } from 'store/services/alerts/createJobAlert.js'

import { getCookie } from 'helpers/cookies'
// import Text from 'components/Text'
import styles from './index.module.scss'
// import { useRouter } from 'next/navigation'
import { buildParams } from 'app/(jobs-hiring)/[lang]/jobs-hiring/interpreters/encoder'
// import { BellIcon } from 'images'
// import { openManageJobAlertsModal } from 'store/actions/modals/manageJobAlertsModal'
import { languageContext } from 'app/components/providers/languageProvider'
import { getAlertData, sortSearchValuesToString, getSearchFiltersIds } from './getAlertData'
import Image from 'next/image'
import JobAlertsModal from './Modal'
import { ClearIcon, UploadDocIcon } from 'images'
import { formatTemplateString, truncateWords } from 'helpers/formatter'

import { displayNotification } from 'store/actions/notificationBar/notificationBar'

const SESSION_SHOULD_HIDE_ALERT_JOBS = 'should-hide-alert-jobs'

const JobAlert = (props: any) => {
  const accessToken = getCookie('accessToken')
  // const router = useRouter()
  const { searchValues, config } = props
  const params = buildParams(config, searchValues)
  const data = getAlertData(searchValues, config)
  const [showJobAlertsModal, setShowJobAlertsModal] = useState(false)
  const [showAlertSetting, setShowAlertSetting] = useState(false)
  const dispatch = useDispatch()
  const { search } = useContext(languageContext) as any

  const companyVerifiedList = [
    {
      key: 'verified-companies',
      ['seo-value']: 'verified-companies',
      value: search.searchModal.viewVerifiedCompanies,
      label: 'View verified companies'
    }
  ]

  const companyVerifiedValues = searchValues.verifiedCompany
    ? (searchValues.verifiedCompany || []).map((val) => {
        const findItem = companyVerifiedList.filter((item) => item['seo-value'] === val)
        return findItem[0]?.value || val
      })
    : undefined

  const viewSearchFilterString = sortSearchValuesToString({
    ...data,
    company_verified_values: companyVerifiedValues
  })

  // console.log('params123', {config, searchValues,  data, viewSearchFilterString})

  const createJobAlert = async (jobAlertData) => {
    try {
      const createJobAlertPayload = { jobAlertData, accessToken }
      const result = await createJobAlertService(createJobAlertPayload)
      if (result?.status >= 200 && result?.status < 300) {
        dispatch(
          displayNotification({
            open: true,
            severity: 'success',
            message: search?.alertJobs?.settingSucceed
          })
        )
        setShowJobAlertsModal(false)
      } else {
        dispatch(
          displayNotification({
            open: true,
            severity: 'error',
            message: search?.alertJobs?.settingFailed
          })
        )
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || search?.alertJobs?.somethingWrong
      dispatch(
        displayNotification({
          open: true,
          severity: 'error',
          message: errorMessage
        })
      )
    }
  }

  useEffect(() => {
    if (typeof sessionStorage != 'undefined') {
      setShowAlertSetting(!sessionStorage.getItem(SESSION_SHOULD_HIDE_ALERT_JOBS))
    }
  }, [])

  const handleSaveJobAlert = (settings: any) => {
    // console.log('save job alert', {settings})
    const data = getAlertData(searchValues, config)
    const newData = getSearchFiltersIds(data)

    const createJobAlertPayload = {
      ...settings,
      keyword: params?.query ? params.query : '',
      is_company_verified: (params.is_company_verified ? '1' : undefined) ?? 'all',
      ...newData
    }
    // console.log('createJobAlertPayload', createJobAlertPayload)
    createJobAlert(createJobAlertPayload)
  }

  const closeAlertSetting = () => {
    setShowAlertSetting(false)
    if (typeof sessionStorage != 'undefined') {
      sessionStorage.setItem(SESSION_SHOULD_HIDE_ALERT_JOBS, '1')
    }
  }

  const showAlertSettingModal = useMemo(() => {
    return showAlertSetting && viewSearchFilterString?.length > 0
  }, [showAlertSetting, viewSearchFilterString])

  const messageInfo = () => {
    if (!search?.alertJobs?.info || !viewSearchFilterString) return ''
    const maxWords = 100
    const newStr = truncateWords(viewSearchFilterString, maxWords)
    return formatTemplateString(search?.alertJobs?.info, {
      message: `<span title="${viewSearchFilterString}" class="${styles.jobListOptionAlertsJobs}">[${newStr}]</span>`
    })
  }

  return (
    <div
      className={
        styles.jobListOptionAlerts + ' ' + (showAlertSettingModal ? '' : styles.hideAlertSetting)
      }
    >
      <div className={styles.jobListOptionAlertsMain}>
        <div className={styles.jobListOptionAlertsLeft}>
          <Image
            src={UploadDocIcon}
            alt='send email'
            width={48}
            height={48}
            className={styles.jobListOptionAlertsImage}
          />
          <div className={styles.jobListOptionAlertsContent}>
            <span className={styles.jobListOptionAlertsTitle}>{search?.alertJobs?.title}</span>
            <span
              className={styles.jobListOptionAlertsQuestion}
              dangerouslySetInnerHTML={{ __html: messageInfo() }}
            ></span>
          </div>
        </div>
        <div className={styles.jobListOptionAlertsRight}>
          <span
            className={styles.jobListOptionAlertsSetting}
            onClick={() => setShowJobAlertsModal(true)}
          >
            {search?.alertJobs?.setting}
          </span>
        </div>
        <div className={styles.jobListOptionAlertsClosed} onClick={closeAlertSetting}>
          <Image src={ClearIcon} width={16} height={16} alt='closed' />
        </div>
      </div>

      <JobAlertsModal
        open={showJobAlertsModal}
        lang={search}
        message={viewSearchFilterString}
        handleSave={handleSaveJobAlert}
        handleClose={() => setShowJobAlertsModal(false)}
      />
    </div>
  )
}
export default JobAlert
