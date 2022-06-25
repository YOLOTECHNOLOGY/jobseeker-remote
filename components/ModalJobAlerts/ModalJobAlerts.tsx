import React, { useState, useEffect } from 'react'

/* Vendor */
import { Radio, RadioGroup, FormControlLabel } from '@mui/material'
import classNames from 'classnames/bind'
import { useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'

/* Helpers */
import { titleCase } from 'helpers/formatter'

/* Components */
import Text from 'components/Text'
import Modal from 'components/Modal'
import Link from 'components/Link'

/* Images */
import { CreateIcon, DeleteIcon } from 'images'

/* Styles */
import styles from './ModalJobAlerts.module.scss'

interface ModalJobAlertsProps {
  query?: any
  location?: any
  jobAlertsList?: any
  createdJobAlert?: any
  isShowModalEnableJobAlerts?: boolean
  handleShowModalEnableJobAlerts?: Function
  isShowModalManageJobAlerts?: boolean
  handleShowModalManageJobAlerts?: Function
  handleFetchJobAlertsList?: Function
  handleDeleteJobAlert?: Function
  handleUpdateJobAlert?: Function
  handleCreateJobAlert?: Function
  isDeletingJobAlert?: boolean
  isUpdatingJobAlert?: boolean
  isCreatingJobAlert?: boolean
  isPublicPostReportJob?: boolean
}

const ModalJobAlerts = ({
  jobAlertsList,
  createdJobAlert,
  isShowModalEnableJobAlerts,
  handleShowModalEnableJobAlerts,
  isShowModalManageJobAlerts,
  handleShowModalManageJobAlerts,
  handleFetchJobAlertsList,
  handleDeleteJobAlert,
  handleUpdateJobAlert,
  handleCreateJobAlert,
  isDeletingJobAlert,
  isUpdatingJobAlert,
  isCreatingJobAlert,
  isPublicPostReportJob,
  location,
  query,
}: ModalJobAlertsProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const [modalUpdateJobAlert, setModalUpdateJobAlert] = useState(false)
  const [modalDeleteJobAlert, setModalDeleteJobAlert] = useState(false)
  const [selectedJobAlert, setSelectedJobAlert] = useState(null)
  const [frequency, setFrequency] = useState(1)
  // const [notifiedAt, setNotifiedAt] = useState('email')
  const [jobAlertResponse, setJobAlertResponse] = useState(null)
  const [formEmail, setFormEmail] = useState('')
  const [jobAlertError, setJobAlertError] = useState(null)

  useEffect(() => {
    if (isShowModalManageJobAlerts && !isDeletingJobAlert) {
      if (isDeletingJobAlert || !isUpdatingJobAlert) {
        handleFetchJobAlertsList()
      }
    }
  }, [isShowModalManageJobAlerts, isDeletingJobAlert, isUpdatingJobAlert])

  useEffect(() => {
    if (createdJobAlert) setJobAlertResponse(createdJobAlert?.response)
    if (createdJobAlert?.error) {
      const errorResponseData = createdJobAlert.error.response?.data
      setJobAlertError(errorResponseData?.data[0].message[0])
    }
  }, [createdJobAlert])

  const onSubmit = ({email}) => {
    handleCreateJobAlert(email)
    setJobAlertResponse(null)
  }

  const resetModalJobAlertState = () => {
    setJobAlertResponse(null)
    setFormEmail('')
    setJobAlertError(null)
  }

  const formatLocationKeyDisplay = (locationKey) => {
    if (!locationKey) return ''

    const locationKeysSplit = locationKey.split('_')
    const locationKeys = []
    locationKeysSplit.map((location) => locationKeys.push(titleCase(location)))
    return locationKeys.join(' ')
  }

  // Modal - Job Alerts List
  // TODO: Implement Filters data from endpoint
  const ModalJobAlertsList = () => {
    return (
      <Modal
        headerTitle='Job Alerts'
        showModal={isShowModalManageJobAlerts}
        handleModal={() => handleShowModalManageJobAlerts(false)}
        firstButtonText='Done'
        handleFirstButton={() => handleShowModalManageJobAlerts(false)}
      >
        <div className={classNames(styles.ModalJobAlertBody, styles.ModalJobAlertsListBody)}>
          <ul className={styles.ModalJobAlertsList}>
            {jobAlertsList?.length > 0 && jobAlertsList.map((alert)  => (
              <li key={alert.id} className={styles.ModalJobAlertsItem}>
                <div className={styles.ModalJobAlertsItemHeader}>
                  <Text textStyle='xl' bold>
                    {titleCase(alert.keyword_value)}
                  </Text>
                  <div className={styles.ModalJobAlertsItemAction}>
                    <img
                      src={CreateIcon}
                      width='18'
                      height='18'
                      onClick={() => {
                        handleShowModalManageJobAlerts(false)
                        setModalUpdateJobAlert(true)
                        setSelectedJobAlert(alert)
                        setFrequency(alert.frequency_value === 'Daily' ? 1 : 2)
                      }}
                      className={styles.ModalJobAlertsItemButton}
                    />
                    <img
                      src={DeleteIcon}
                      width='18'
                      height='18'
                      onClick={() => {
                        handleShowModalManageJobAlerts(false)
                        setModalDeleteJobAlert(true)
                        setSelectedJobAlert(alert)
                      }}
                      className={styles.ModalJobAlertsItemButton}
                    />
                  </div>
                </div>
                <div className={styles.ModalJobAlertsItemBody}>
                  <Text textStyle='base' bold>{formatLocationKeyDisplay(alert.location_value)}</Text>
                  <Text textStyle='base'>Filters: {alert.filters} </Text>
                  <Text textStyle='base'>Frequency: via {alert.frequency_value}</Text>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    )
  }

  // Modal - Update Job Alert
  const ModalUpdateJobAlert = () => {
    const handleChange = (event, isFrequency) => {
      if (isFrequency) {
        setFrequency(event.target.value)
        return
      }
      // setNotifiedAt(event.target.value)
    }

    return (
      <Modal
        headerTitle='Manage Job Alert'
        showModal={modalUpdateJobAlert}
        handleModal={() => setModalUpdateJobAlert(false)}
        firstButtonText='Back'
        handleFirstButton={() => {
          setModalUpdateJobAlert(false)
          handleShowModalManageJobAlerts(true)
        }}
        secondButtonText='Done'
        handleSecondButton={() => {
          setModalUpdateJobAlert(false)
          handleShowModalManageJobAlerts(true)
          handleUpdateJobAlert({
            id: selectedJobAlert.id,
            frequency_id: frequency
          })
        }}
      >
        <div className={styles.ModalJobAlertBody}>
          <div className={styles.ModalUpdateJobAlert}>
            <div className={styles.ModalUpdateJobAlertHeader}>
              <Text textStyle='xl' bold>{titleCase(selectedJobAlert?.keyword_value)}</Text>
              <img
                src={DeleteIcon}
                width='18'
                height='18'
                onClick={() => {
                  handleShowModalManageJobAlerts(false)
                  setModalUpdateJobAlert(false)
                  setModalDeleteJobAlert(true)
                }}
              />
            </div>
            <div className={styles.ModalUpdateJobAlertSub}>
              <Text textStyle='base' bold>{selectedJobAlert?.location_value}</Text>
              <Text textStyle='base'>Filters: {selectedJobAlert?.filters}</Text>
            </div>

            <div className={styles.ModalUpdateJobAlertBody}>
              <div className={styles.ModalUpdateJobAlertGroup}>
                <Text textStyle='base' bold className={styles.ModalUpdateJobAlertGroupHeader}>
                  Alert Frequency
                </Text>
                <RadioGroup
                  aria-label='frequency'
                  name='controlled-radio-buttons-group'
                  value={frequency}
                  onChange={(e) => handleChange(e, true)}
                >
                  <FormControlLabel
                    value='1'
                    control={<Radio />}
                    label={<Text textStyle='base'>Daily</Text>}
                  />
                  <FormControlLabel
                    value='2'
                    control={<Radio />}
                    label={<Text textStyle='base'>Weekly</Text>}
                  />
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  // Modal - Delete Job Alert
  const ModalDeleteJobAlert = () => {
    return (
      <Modal
        headerTitle='Delete Job Alert'
        showModal={modalDeleteJobAlert}
        handleModal={() => setModalDeleteJobAlert(false)}
        firstButtonText='Keep'
        handleFirstButton={() => {
          setModalDeleteJobAlert(false)
          handleShowModalManageJobAlerts(true)
        }}
        secondButtonText='Delete'
        handleSecondButton={() => {
          setModalDeleteJobAlert(false)
          handleShowModalManageJobAlerts(true)
          handleDeleteJobAlert(selectedJobAlert.id)
        }}
      >
        <div className={styles.ModalJobAlertBody}>
          <Text textStyle='base'>
            {selectedJobAlert && (
              <span>You are about to delete the job alert for <strong>“{titleCase(selectedJobAlert?.keyword_value)}, {selectedJobAlert?.location_value}“</strong>.</span>
            )}
            <br /> This cannot be undone
          </Text>
        </div>
      </Modal>
    )
  }

  // Public Job Alerts
  if (isPublicPostReportJob) {
    if (!jobAlertResponse?.id){      
      return (
        <Modal
          headerTitle='Enable Job Alert'
          showModal={isShowModalEnableJobAlerts}
          handleModal={() => {
            handleShowModalEnableJobAlerts(false)
            resetModalJobAlertState()
          }}
          firstButtonText={`${isCreatingJobAlert ? 'Submitting...' : 'Submit'}`}
          handleFirstButton={handleSubmit(onSubmit)}
        >
          <div className={styles.ModalJobAlertBody}>
            <Text textStyle='lg'>
              Get email updtes for {' '}
              <Text textStyle='base' bold>{query ? query : 'all'}</Text> 
              {location && location.length !== 0 && (
                <>
                  {' '} jobs in {' '}
                  <Text textStyle='base' bold>{location.value}</Text>
                </>
              )}.
            </Text>
            <div>
              <TextField 
                {...register('email', { required: true })} 
                className={styles.ModalJobAlertBodyInput}
                id='outlined-basic' 
                label='Email' 
                variant='outlined'
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
              {errors.email && <Text textStyle='sm' textColor='red'>This field is required</Text>}
              {jobAlertError && <Text textStyle='sm' textColor='red'>{jobAlertError}</Text>}
            </div>
            <Text textStyle='xsm' tagName='p'>By creating this job alert, you agree to the Bossjob {' '}
              <Link to={'/'}>
                <Text textColor='primaryBlue'>Term of Use</Text>
              </Link>
              {' '} and {' '} 
              <Link to={'/'}>
                <Text textColor='primaryBlue'>Privacy Policy</Text>.
              </Link>
              {' '} You can unsubscribe from these emails at any time.</Text>
          </div>
        </Modal>
      )
    }
    return (
      <Modal
        headerTitle='Enable Job Alert'
        showModal={isShowModalEnableJobAlerts}
        handleModal={() => {
          handleShowModalEnableJobAlerts(false)
          resetModalJobAlertState()
        }}
        firstButtonText='Done'
        handleFirstButton={() => {
          handleShowModalEnableJobAlerts(false)
          resetModalJobAlertState()
        }}
      >
        <div className={styles.ModalJobAlertBody}>
          <Text textStyle='xxl' bold tagName='p' className={styles.ModalJobAlertBodyEnabled}>Job alert is enabled.</Text>
          <Text textStyle='lg' tagName='p' className={styles.ModalJobAlertBodyEnabled}>Please check your email to verify your account. </Text>
        </div>
      </Modal>
    )
  }

  // Manage Job Alerts
  if (!isShowModalEnableJobAlerts) {
    return (
      <React.Fragment>
        <ModalJobAlertsList />
        <ModalUpdateJobAlert />
        <ModalDeleteJobAlert />
      </React.Fragment>
    )
  }

  // Enable Job Alerts
  if (isShowModalEnableJobAlerts) {
    return (
      <Modal
        showModal={isShowModalEnableJobAlerts}
        handleModal={() => handleShowModalEnableJobAlerts(false)}
        headerTitle='Enable job alert'
        handleFirstButton={() => {
          handleShowModalEnableJobAlerts(false)
          handleShowModalManageJobAlerts(true)
        }}
        handleSecondButton={() => {
          handleShowModalEnableJobAlerts(false)
          setSelectedJobAlert(jobAlertResponse)
          setModalDeleteJobAlert(true)
        }}
        firstButtonText='Keep'
        secondButtonText='Delete'
      >
        <div className={styles.ModalJobAlertBody}>
          <Text textStyle='base'>
            {jobAlertResponse && (
              <React.Fragment>
                <span>Job alert for ‘<Text textStyle='base' bold>{query ? query : 'all'}</Text>’ enabled.</span>
                <Text
                  className={styles.ModalEnableJobAlertText}
                  textColor='primaryBlue'
                  onClick={() => {
                    handleShowModalEnableJobAlerts(false)
                    setSelectedJobAlert(jobAlertResponse)
                    setModalUpdateJobAlert(true)
                    setFrequency(jobAlertResponse.frequency_id)
                  }}
                >
                  {' '}
                  Manage alert.
                </Text>
              </React.Fragment>
            )}
            {!jobAlertResponse && (
              <span>No selected keyword.</span>
            )}
          </Text>
        </div>
      </Modal>
    )
  }
}

export default ModalJobAlerts