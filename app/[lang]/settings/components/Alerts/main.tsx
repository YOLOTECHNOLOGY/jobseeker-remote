import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'

import { fetchJobAlertsListRequest } from 'store/actions/alerts/fetchJobAlertsList'
import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'
import Text from 'components/Text'
import Modal from '../Modal'
import { BossjobLogo } from 'images'

import Radio from '@mui/material/Radio'
import { Button } from '@mui/material'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import LinearProgress from '@mui/material/LinearProgress'
import Loading from 'app/components/loading'

// actions
import { updateJobAlertRequest } from 'store/actions/alerts/updateJobAlert'
import { deleteJobAlertRequest } from 'store/actions/alerts/deleteJobAlert'
import { closeCreateJobAlertModal } from 'store/actions/modals/createJobAlertModal'
import { openCreateJobAlertModal } from 'store/actions/modals/createJobAlertModal'

// styles
import styles from './index.module.scss'
import { useRouter } from 'next/navigation'
import useWindowDimensions from 'helpers/useWindowDimensions'
import { changeAlertValue } from 'helpers/config/changeAlertValue'
import { MemoedFilters } from 'components/ModalJobAlerts/MemoedFilter'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialTextField from 'components/MaterialTextField'
const Alerts = ({ accessToken, lang }: any) => {
  const router = useRouter()
  const { search, accountSetting } = lang
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const [alertEdit, setAlertEdit] = useState(null)
  const [removeId, setRemoveId] = useState(null)
  const [open, setOpen] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
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

  const handleSave = () => {}
  const handleClose = () => {
    setOpen(false)
  }
  const handleConfirm = () => {}

  return (
    <div className={styles.JobAlertContainer}>
      <div className={styles.JobAlertContainer_wrapper}>
        <Text tagName='h2' className={styles.JobAlertTitle}>
          {accountSetting.jobAlertTitle}
        </Text>
        {isLoading && (
          <div className={styles.loading}>
            <Loading />
          </div>
        )}
        {!isLoading && (
          <div>
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
                  <Text block className={styles.JobAlertContainer_desc}>
                    {accountSetting.email}: {item.email}
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
        )}

        <Modal
          key={'Job-Alert-Setting'}
          open={open}
          cancel='Cancel'
          confirm='Done'
          handleSave={handleSave}
          handleClose={handleClose}
          title='Job Alert Setting'
          lang={lang}
        >
          <div className={styles.modal}>
            <div className={styles.item}>
              <p className={styles.title}>Job filters</p>
              <p className={styles.content}>Chongqing - java - Bachelor</p>
            </div>
            <div className={styles.item}>
              <p className={`${styles.title} ${styles.titleFilters}`}>Job filters</p>
              <div className={styles.select}>
                <MaterialBasicSelect
                  options={[]}
                  className={styles.fullWidth}
                  variant='standard'
                ></MaterialBasicSelect>
              </div>
            </div>
            <div className={styles.item}>
              <p className={`${styles.title} ${styles.titleFilters}`}>Job filters</p>
              <div className={styles.select}>
                <MaterialTextField
                  value={'Johndoe@gmail.com'}
                  className={styles.fullWidth}
                  variant='standard'
                ></MaterialTextField>
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          key={'openDelete'}
          open={openDelete}
          cancel='Cancel'
          confirm='yes'
          handleSave={handleConfirm}
          handleClose={() => setOpenDelete(false)}
          title='Job Alert Setting'
          lang={lang}
        >
          <div className={styles.modal}>
            Are you sure you want to delete this job reminder? After deleting, you will not be able
            to get high-quality job recommendation information
          </div>
        </Modal>

        {/* <Modal
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
        </Modal> */}
      </div>
    </div>
  )
}

export default Alerts
