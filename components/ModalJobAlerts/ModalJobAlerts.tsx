import React, { useState, useEffect } from 'react'

/* Vendor */
import { Radio, RadioGroup, FormControlLabel } from '@mui/material'
import classNames from 'classnames/bind'
import Image from 'next/image'

/* Helpers */
import { titleCase } from 'helpers/formatter'

/* Components */
import Text from 'components/Text'
import Modal from 'components/Modal'

/* Images */
import { CreateIcon, DeleteIcon } from 'images'

/* Styles */
import styles from './ModalJobAlerts.module.scss'

interface ModalJobAlertsProps {
  query?: any
  jobAlertsList?: any
  createdJobAlert?: any
  isShowModalEnableJobAlerts?: boolean
  handleShowModalEnableJobAlerts?: Function
  isShowModalManageJobAlerts?: boolean
  handleShowModalManageJobAlerts?: Function
  handleFetchJobAlertsList?: Function
  handleDeleteJobAlert?: Function
  handleUpdateJobAlert?: Function
  isDeletingJobAlert?: boolean
  isUpdatingJobAlert?: boolean
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
  isDeletingJobAlert,
  isUpdatingJobAlert
}: ModalJobAlertsProps) => {
  const [modalUpdateJobAlert, setModalUpdateJobAlert] = useState(false)
  const [modalDeleteJobAlert, setModalDeleteJobAlert] = useState(false)
  const [selectedJobAlert, setSelectedJobAlert] = useState(null)
  const [frequency, setFrequency] = useState(0)
  const [notifiedAt, setNotifiedAt] = useState('email')

  useEffect(() => {
    if (isShowModalManageJobAlerts && !isDeletingJobAlert) {
      if (isDeletingJobAlert || !isUpdatingJobAlert) {
        handleFetchJobAlertsList()
      }
    }
  }, [isShowModalManageJobAlerts, isDeletingJobAlert, isUpdatingJobAlert])

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
                  <Text textStyle='lg' bold>
                    {alert.keyword}
                  </Text>
                  <div className={styles.ModalJobAlertsItemAction}>
                    <Image
                      src={CreateIcon}
                      width='18'
                      height='18'
                      onClick={() => {
                        handleShowModalManageJobAlerts(false)
                        setModalUpdateJobAlert(true)
                        setSelectedJobAlert(alert)
                        setFrequency(alert.frequency_id)
                      }}
                      className={styles.ModalJobAlertsItemButton}
                    />
                    <Image
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
                  <Text textStyle='base' bold>{titleCase(alert.location_key)}</Text>
                  <Text textStyle='base'>Filters: Full-time, Marketing/Business Dev </Text>
                  <Text textStyle='base'>Frequency: {alert.frequency} via email</Text>
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
      setNotifiedAt(event.target.value)
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
              <Text textStyle='lg' bold>
                {selectedJobAlert?.keyword}
              </Text>
              <Image
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
            <div className={styles.ModalUpdateJobAlertBody}>
              <div className={styles.ModalUpdateJobAlertGroup}>
                <Text textStyle='base' className={styles.ModalUpdateJobAlertGroupHeader}>
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

              <div className={styles.ModalUpdateJobAlertGroup}>
                <Text textStyle='base' className={styles.ModalUpdateJobAlertGroupHeader}>
                  Get notified via:
                </Text>
                <RadioGroup
                  aria-label='notifiedAt'
                  name='controlled-radio-buttons-group'
                  value={notifiedAt}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value='email'
                    control={<Radio />}
                    label={<Text textStyle='base'>Email</Text>}
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
              <span>You are about to delete the job alert for <strong>“{selectedJobAlert?.keyword}, {titleCase(selectedJobAlert?.location_key)}“</strong>.</span>
            )}
            <br /> This cannot be undone
          </Text>
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
          setSelectedJobAlert(createdJobAlert)
          setModalDeleteJobAlert(true)
        }}
        firstButtonText='Keep'
        secondButtonText='Delete'
      >
        <div className={styles.ModalJobAlertBody}>
          <Text textStyle='base'>
            {createdJobAlert && (
              <React.Fragment>
                <span>Job alert for ‘<Text textStyle='base' bold>{createdJobAlert?.keyword}</Text>’ enabled.</span>
                <Text
                  className={styles.ModalEnableJobAlertText}
                  textColor='primaryBlue'
                  onClick={() => {
                    handleShowModalEnableJobAlerts(false)
                    setSelectedJobAlert(createdJobAlert)
                    setModalUpdateJobAlert(true)
                  }}
                >
                  {' '}
                  Manage alert.
                </Text>
              </React.Fragment>
            )}
            {!createdJobAlert && (
              <span>No selected keyword.</span>
            )}
          </Text>
        </div>
      </Modal>
    )
  }
}

export default ModalJobAlerts