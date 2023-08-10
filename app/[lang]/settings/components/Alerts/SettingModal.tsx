import React, { useMemo, useState } from 'react'

import { MenuItem, Select } from '@mui/material'
import MaterialTextField from 'components/MaterialTextField'
import Modal from '../Modal'

import { validEmailReg } from '../../config'
import styles from './index.module.scss'

interface IProps {
  open: boolean
  lang: any
  job: any
  config: any
  title: string
  handleClose: () => void
  handleSave: Function
  filterValues?: Function
  isLoading?: boolean
}

const SettingModal = (props: IProps) => {
  const { open, lang, config, job, title, isLoading, handleClose, handleSave, filterValues } = props
  const alertJobsModal = lang?.search?.alertJobsModal || {}
  const accountSetting = lang?.accountSetting || {}
  const [frequencyId, setFrequencyId] = useState(job?.frequency_id || '')
  const [email, setEmail] = useState(job?.email)
  const [emailError, setEmailError] = useState(null)

  const frequencyList = useMemo(() => {
    return config.subscibe_job_frequency_lists || []
  }, [config])

  const handleMethodSave = () => {
    handleSave({ frequency_id: frequencyId, email, id: job?.id })
  }

  const handleMethodClose = () => {
    setFrequencyId('')
    setEmail('')
    handleClose()
  }

  const validEmail = (value: string) => {
    let errorMessage = !validEmailReg.test(value) ? alertJobsModal?.emailValid : ''
    if (value == '') {
      errorMessage = alertJobsModal?.emailEmpty
    }
    return errorMessage
  }

  const disabledSave = useMemo(() => {
    const errorMessage = !!validEmail(email)
    return errorMessage || !frequencyId
  }, [email])

  const handleKeyUp = (ev) => {
    const value = ev?.target?.value || ''
    setEmailError(validEmail(value))
  }

  return (
    <div>
      <Modal
        key={'Job-Alert-Setting'}
        open={open}
        cancel={accountSetting?.cancel}
        confirm={accountSetting?.done}
        handleSave={handleMethodSave}
        handleClose={handleMethodClose}
        title={title}
        isLoading={isLoading}
        lang={lang}
        disabled={disabledSave}
      >
        <div className={styles.modal}>
          <div className={styles.item}>
            <p className={styles.title}>{accountSetting?.jobFilter}</p>
            <p className={styles.content} title={job ? filterValues(job) : null}>
              {job ? filterValues(job) : null}
            </p>
          </div>
          <div className={styles.item}>
            <p className={`${styles.title} ${styles.titleFilters}`}>{accountSetting?.frequency}</p>
            <div className={styles.select}>
              <Select
                variant='standard'
                value={frequencyId}
                onChange={(ev) => setFrequencyId(ev.target.value)}
              >
                {frequencyList &&
                  frequencyList.map((item) => {
                    return (
                      <MenuItem value={item.id} key={item.id}>
                        {item.value}
                      </MenuItem>
                    )
                  })}
              </Select>
            </div>
          </div>
          <div className={styles.item} style={{ marginTop: '36px' }}>
            <p className={`${styles.title} ${styles.titleFilters}`}>
              {accountSetting?.sendToEmail}
            </p>
            <div className={styles.select}>
              <MaterialTextField
                value={email}
                className={styles.fullWidth}
                variant='standard'
                onChange={(ev) => setEmail(ev.target.value)}
                onKeyUp={handleKeyUp}
              ></MaterialTextField>
            </div>
            {emailError ? <div className={styles.errorInfo}>{emailError}</div> : null}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SettingModal
