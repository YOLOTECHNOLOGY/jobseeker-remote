import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'

import { fetchJobAlertsListRequest } from 'store/actions/alerts/fetchJobAlertsList'
import FieldFormWrapper from '../FieldFormWrapper'
import Text from 'components/Text'
import Modal from 'components/Modal'
import { BossjobLogo } from 'images'

import Radio from '@mui/material/Radio'
import { Button } from '@mui/material'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import LinearProgress from '@mui/material/LinearProgress'

// actions
import { updateJobAlertRequest } from 'store/actions/alerts/updateJobAlert'
import { deleteJobAlertRequest } from 'store/actions/alerts/deleteJobAlert'
import { closeCreateJobAlertModal } from 'store/actions/modals/createJobAlertModal'
import { openCreateJobAlertModal } from 'store/actions/modals/createJobAlertModal'

// styles
import styles from './index.module.scss'
import { useRouter } from 'next/router'
import useWindowDimensions from 'helpers/useWindowDimensions'
import { changeAlertValue } from 'helpers/config/changeAlertValue'
import { MemoedFilters } from 'components/ModalJobAlerts/MemoedFilter'

const Alerts = ({ accessToken, lang }: any) => {
  const router = useRouter()
  const { search, accountSetting } = lang
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const [alertEdit, setAlertEdit] = useState(null)
  const [removeId, setRemoveId] = useState(null)
  const jobAlertListResponse = useSelector((store: any) => store.alerts.fetchJobAlertsList.response)
  const isLoading = useSelector((store: any) => store.alerts.fetchJobAlertsList.fetching)
  const showCreateJobAlertModal = useSelector((store: any) => store.modal.createJobAlertModal.show)
  const config = useSelector((store: any) => store.config.config.response)
  const frequencyList = useMemo(() => {
    return config.subscibe_job_frequency_lists
  }, [config])

  const formattedAlertList = useMemo(() => {
    jobAlertListResponse?.forEach?.((item) => {
      changeAlertValue(item, config)
    })
    return jobAlertListResponse
  }, [jobAlertListResponse, config])
  useEffect(() => {
    getFetchAlertsListRequest()
  }, [])

  const getFetchAlertsListRequest = () => {
    dispatch(fetchJobAlertsListRequest({ accessToken }))
  }

  const showDeleteJobAlertModule = (id) => {
    setRemoveId(id)
    dispatch(openCreateJobAlertModal())
  }

  const deleteJobAlert = () => {
    const payload = {
      accessToken,
      jobAlertId: removeId
    }
    dispatch(deleteJobAlertRequest(payload))
    getFetchAlertsListRequest()
  }

  const handelSaveSetFrequency = (item) => {
    debugger
    const payload = {
      accessToken,
      updateJobAlertData: {
        id: item.id,
        frequency_id: item.frequency_id
      }
    }
    dispatch(updateJobAlertRequest(payload))
  }

  const handleFrequencyRadio = (item, id) => {
    item.frequency_id = parseInt(id)
    item.frequency_value = frequencyList?.find((frequency) => frequency.id === +id)?.value
  }

  const handelBackToJobSearch = () => {
    router.push('/jobs-hiring/job-search')
  }
  return (
    <div className={styles.JobAlertContainer}>
      <div className={styles.JobAlertContainer_wrapper}>
        {isLoading && (
          <div>
            <div className={styles.JobAlertContainerInfo}>
              <div className={styles.JobAlertContainerLoading}>
                <div className={styles.loadingLogo}>
                  <img src={BossjobLogo} title='Bossjob logo' alt='Bossjob logo' />
                </div>
                <div className={styles.loadingIndicator}>
                  <LinearProgress />
                </div>
              </div>
            </div>
          </div>
        )}
        {!isLoading && (
          <div
          // className={jobAlertListResponse.length ? styles.JobAlertContainer_mobileWrapper : ''}
          >
            {(width ?? 0) > 576 && (
              <Text tagName='h2' className={styles.JobAlertTitle}>
                {accountSetting.jobAlertTitle}
              </Text>
            )}
            <div
            // className={jobAlertListResponse.length ? styles.JobAlertContainer_mobileStyle : ''}
            >
              {formattedAlertList.length ? (
                formattedAlertList.map((item, index) => (
                  <FieldFormWrapper
                    label={item.id}
                    alertTitle={item.keyword_value}
                    isEdit
                    isDetele
                    key={item.id}
                    className={styles.fieldWrapper}
                    textClassName={styles.fieldWrapperTitle}
                    edit={alertEdit}
                    setEdit={setAlertEdit}
                    deleteJobAlert={showDeleteJobAlertModule}
                  >
                    <Text block className={styles.JobAlertContainer_title}>
                      {item.location_value}
                    </Text>
                    <Text block className={styles.JobAlertContainer_desc}>
                      {accountSetting.filter}:{' '}
                      <MemoedFilters config={config} alert={item} lang={search} />
                    </Text>
                    <Text block className={styles.JobAlertContainer_desc}>
                      {accountSetting.frequency}: {item.frequency_value}
                    </Text>
                    {alertEdit === item.id && (
                      <div>
                        <div className={styles.JobAlertContainer_EditContainer}>
                          <Text
                            tagName='h5'
                            textStyle='base'
                            bold
                            className={styles.JobAlertContainer_Text}
                          >
                            {accountSetting.alertFrequency}
                          </Text>
                          <div>
                            <RadioGroup
                              aria-labelledby='demo-radio-buttons-group-label'
                              defaultValue={item.frequency_id}
                              name='radio-buttons-group'
                              onChange={(ev, value) => handleFrequencyRadio(item, value)}
                            >
                              {frequencyList?.map((item) => {
                                return (
                                  <FormControlLabel
                                    key={item.id}
                                    value={item.id}
                                    control={<Radio />}
                                    label={item.value}
                                  />
                                )
                              })}
                            </RadioGroup>
                          </div>
                        </div>
                        <div className={styles.JobAlertContainer_button}>
                          <Button
                            variant='contained'
                            onClick={() => {
                              setAlertEdit(null), handelSaveSetFrequency(item)
                            }}
                          >
                            {accountSetting.save}
                          </Button>
                          <Button
                            variant='outlined'
                            onClick={() => {
                              setAlertEdit(null),
                                (item.frequency_value = item.default_frequency_value
                                  ? item.default_frequency_value
                                  : item.frequency_value)
                            }}
                          >
                            {accountSetting.cancel}
                          </Button>
                        </div>
                      </div>
                    )}

                    {index !== formattedAlertList.length - 1 && (
                      <div className={styles.fieldWrapper_border}></div>
                    )}
                  </FieldFormWrapper>
                ))
              ) : (
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
              )}
            </div>
          </div>
        )}

        <Modal
          headerTitle={accountSetting.deleteTitle}
          showModal={showCreateJobAlertModal}
          handleModal={() => {
            dispatch(closeCreateJobAlertModal())
          }}
          firstButtonText={accountSetting.keep}
          firstButtonIsClose={true}
          handleFirstButton={() => {
            dispatch(closeCreateJobAlertModal())
          }}
          handleSecondButton={() => {
            dispatch(closeCreateJobAlertModal())
            deleteJobAlert()
          }}
          secondButtonText={accountSetting.delete}
        >
          <div className={styles.ModalJobAlertBody}>
            <Text textStyle='lg' tagName='p' className={styles.ModalJobAlertBodyEnabled}>
              {accountSetting.deleteTips}
            </Text>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Alerts
