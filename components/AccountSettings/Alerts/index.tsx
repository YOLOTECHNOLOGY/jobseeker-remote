import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

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

const Alerts = ({ accessToken }: any) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [alertEdit, setAlertEdit] = useState(null)
  const [removeId, setRemoveId] = useState(null)

  const jobAlertListResponse = useSelector((store: any) => store.alerts.fetchJobAlertsList.response)
  const isLoading = useSelector((store: any) => store.alerts.fetchJobAlertsList.fetching)
  const showCreateJobAlertModal = useSelector((store: any) => store.modal.createJobAlertModal.show)

  useEffect(() => {
    getFetchAlertsListRequest()
  }, [])

  // useEffect(() => {
  //   if (removeId) {
  //     dispatch(openCreateJobAlertModal())
  //   }
  // }, [removeId])

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
    const payload = {
      accessToken,
      updateJobAlertData: {
        id: item.id,
        frequency_id: item.frequency_value === 'Daily' ? '1' : '2'
      }
    }
    dispatch(updateJobAlertRequest(payload))
  }

  const handleFrequencyRadio = (item, ev) => {
    if (!item.default_frequency_value) {
      item.default_frequency_value = item.frequency_value
    }
    item.frequency_value = ev.target?._wrapperState?.initialValue
  }

  const handelBackToJobSearch = () => {
    router.push('/jobs-hiring/job-search')
  }

  return (
    <div className={styles.JobAlertContainer}>
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
        <div>
          <Text tagName='h2' className={styles.JobAlertTitle}>
            Job alert
          </Text>
          {jobAlertListResponse.length ? (
            jobAlertListResponse.map((item, index) => (
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
                  Filters: {item.filters}
                </Text>
                <Text block className={styles.JobAlertContainer_desc}>
                  Frequency: {item.frequency_value}
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
                        Alert Frequency
                      </Text>
                      <div>
                        <RadioGroup
                          aria-labelledby='demo-radio-buttons-group-label'
                          defaultValue={item.frequency_value}
                          name='radio-buttons-group'
                          onChange={(ev) => handleFrequencyRadio(item, ev)}
                        >
                          <FormControlLabel value='Daily' control={<Radio />} label='Daily' />
                          <FormControlLabel value='Weekly' control={<Radio />} label='Weekly' />
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
                        Save
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
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {index !== jobAlertListResponse.length - 1 && (
                  <div className={styles.fieldWrapper_border}></div>
                )}
              </FieldFormWrapper>
            ))
          ) : (
            <div className={styles.JobAlertContainer_noJobAlert}>
              <Text block>You have no job alert yet. </Text>
              <Button
                variant='contained'
                onClick={() => {
                  handelBackToJobSearch()
                }}
                className={styles.JobAlertContainer_noJobAlert_backBtn}
              >
                Back to job search
              </Button>
            </div>
          )}
        </div>
      )}

      <Modal
        headerTitle='Delete job alert'
        showModal={showCreateJobAlertModal}
        handleModal={() => {
          dispatch(closeCreateJobAlertModal())
        }}
        firstButtonText='Keep'
        firstButtonIsClose={true}
        handleFirstButton={() => {
          dispatch(closeCreateJobAlertModal())
        }}
        handleSecondButton={() => {
          dispatch(closeCreateJobAlertModal())
          deleteJobAlert()
        }}
        secondButtonText='Delete'
      >
        <div className={styles.ModalJobAlertBody}>
          <Text textStyle='lg' tagName='p' className={styles.ModalJobAlertBodyEnabled}>
            You are about to delete this job alert. This cannot be undone.{' '}
          </Text>
        </div>
      </Modal>
    </div>
  )
}

export default Alerts
