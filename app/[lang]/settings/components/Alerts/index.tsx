import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'

import Text from 'components/Text'
import Modal from '../Modal'
import SettingModal from './SettingModal'

import { Button } from '@mui/material'
import Loading from 'app/components/loading'
import Image from 'next/image'

// actions
import { fetchJobAlertsListRequest } from 'store/actions/alerts/fetchJobAlertsList'
import { updateJobAlertRequest } from 'store/actions/alerts/updateJobAlert'
import { deleteJobAlertRequest } from 'store/actions/alerts/deleteJobAlert'
import { openCreateJobAlertModal } from 'store/actions/modals/createJobAlertModal'

// styles
import styles from './index.module.scss'
import { useRouter } from 'next/navigation'
import { changeAlertValue } from 'helpers/config/changeAlertValue'
import { MemoedFilters } from 'components/ModalJobAlerts/MemoedFilter'
import { AccountSettingDeleteIconBin, AccountSettingEditIconPen } from 'images'

const Alerts = ({ accessToken, lang }: any) => {
  const router = useRouter()
  const { search, accountSetting } = lang
  const dispatch = useDispatch()
  const [removeId, setRemoveId] = useState(null)
  const [open, setOpen] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const jobAlertListResponse = useSelector((store: any) => store.alerts.fetchJobAlertsList.response)
  const isLoading = useSelector((store: any) => store.alerts.fetchJobAlertsList.fetching)
  const config = useSelector((store: any) => store.config.config.response)
  const [currentJobAlert, setCurrentJobAlert] = useState(null)

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

  const deleteJobAlert = (id) => {
    const payload = {
      accessToken,
      jobAlertId: id
    }
    dispatch(deleteJobAlertRequest(payload))
    getFetchAlertsListRequest()
  }

  const handelSaveSetFrequency = (item) => {
    const payload = {
      accessToken,
      updateJobAlertData: {
        email: item.email,
        id: item.id,
        frequency_id: item.frequency
      }
    }
    dispatch(updateJobAlertRequest(payload))
  }

  const handelBackToJobSearch = () => {
    router.push('/jobs-hiring/job-search')
  }

  const filterValues = (item) => {
    const keyword = item.keyword_value ? item.keyword_value + ', ' : ''
    return keyword + item.filters
  }

  const handleEditJobAlert = (item) => {
    console.log('handleEdit', item)
    if (item) {
      setOpen(true)
      setCurrentJobAlert(item)
    }
  }

  const handleDeleteJobAlert = (item) => {
    console.log('handleDelete', item)
    if (item) {
      setOpenDelete(true)
      setCurrentJobAlert(item)
    }
  }

  const handleSettingSave = (data) => {
    console.log('save', data)
    if (data) {
      setCurrentJobAlert(null)
      setOpen(false)
      handelSaveSetFrequency(data)
    }
  }

  const handleSettingClose = () => {
    setCurrentJobAlert(null)
    setOpen(false)
  }

  const handleDeleteConfirm = () => {
    console.log('delete', currentJobAlert)
    if (currentJobAlert?.id) {
      deleteJobAlert(currentJobAlert?.id)
    }
  }

  const handleDeleteClose = () => {
    setCurrentJobAlert(null)
    setOpenDelete(false)
  }

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
          <>
            {formattedAlertList.length ? (
              formattedAlertList.map((item) => (
                <div className={styles.JobAlertContainer_item} key={item.id}>
                  <div className={styles.JobAlertContainer_desc}>
                    <div className={styles.JobAlertContainer_left}>
                      {accountSetting.filter}:
                      <div className={styles.JobAlertContainer_filter} title={filterValues(item)}>
                        {filterValues(item)}
                      </div>
                    </div>
                    <div className={styles.JobAlertContainer_right}>
                      <Image
                        src={AccountSettingEditIconPen}
                        onClick={() => handleEditJobAlert(item)}
                        width={14}
                        height={16}
                        alt='edit'
                      ></Image>
                      <Image
                        src={AccountSettingDeleteIconBin}
                        onClick={() => handleDeleteJobAlert(item)}
                        width={14}
                        height={16}
                        alt='delete'
                      ></Image>
                    </div>
                  </div>
                  <div className={styles.JobAlertContainer_desc}>
                    {accountSetting.frequency}: {item.frequency_value}
                  </div>
                  <div className={styles.JobAlertContainer_desc}>
                    {accountSetting.email}: {item.email}
                  </div>
                </div>
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
          </>
        )}

        <SettingModal
          key={'Job-Alert-Setting' + currentJobAlert?.id}
          open={open}
          config={config}
          job={currentJobAlert}
          filterValues={filterValues}
          handleSave={handleSettingSave}
          handleClose={handleSettingClose}
          lang={lang}
        />

        <Modal
          key={'openDelete' + currentJobAlert?.id}
          open={openDelete}
          cancel='Cancel'
          confirm='yes'
          handleSave={handleDeleteConfirm}
          handleClose={handleDeleteClose}
          title='Job Alert Setting'
          lang={lang}
        >
          <div className={styles.modal}>
            Are you sure you want to delete this job reminder? After deleting, you will not be able
            to get high-quality job recommendation information
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Alerts
