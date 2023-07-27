import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import Image from 'next/image'
import { Button } from '@mui/material'
import Loading from 'app/components/loading'
import Text from 'components/Text'
import { changeAlertValue } from 'helpers/config/changeAlertValue'
import Modal from '../Modal'
import SettingModal from './SettingModal'
// import { MemoedFilters } from 'components/ModalJobAlerts/MemoedFilter'

// actions
import { fetchJobAlertsListService } from 'store/services/alerts/fetchJobAlertsList'
import { updateJobAlertService } from 'store/services/alerts/updateJobAlert'
import { deleteJobAlertService } from 'store/services/alerts/deleteJobAlert'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// styles
import { AccountSettingDeleteIconBin, AccountSettingEditIconPen } from 'images'
import styles from './index.module.scss'

interface IProps {
  accessToken: string
  lang: any
}

const AlertJobs = (props: IProps) => {
  const { accessToken, lang } = props
  const router = useRouter()
  const { accountSetting } = lang
  const dispatch = useDispatch()
  const [open, setOpen] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [jobAlertList, setJobAlertList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const config = useSelector((store: any) => store.config.config.response)
  const [currentJobAlert, setCurrentJobAlert] = useState(null)

  useEffect(() => {
    getAlertsListRequest()
  }, [])

  const handleError = (error) => {
    const { data } = error.response
    let errorMessage
    if (data?.data) {
      errorMessage = data?.data?.detail ?? data?.message
    } else {
      errorMessage = data?.errors?.phone_num[0]
    }
    dispatch(
      displayNotification({
        open: true,
        message: errorMessage || data.message,
        severity: 'error'
      })
    )
  }

  const getAlertsListRequest = async () => {
    try {
      setIsLoading(true)
      const list = await fetchJobAlertsListService({ accessToken })
      const resData = list.data.data || []
      resData?.forEach?.((item) => {
        changeAlertValue(item, config)
      })
      setJobAlertList(resData)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleError(error)
    }
  }

  const deleteJobAlert = async (id) => {
    try {
      const payload = {
        accessToken,
        jobAlertId: id
      }
      await deleteJobAlertService(payload)
      await getAlertsListRequest()
      setCurrentJobAlert(null)
      setOpenDelete(false)
    } catch (error) {
      handleError(error)
    }
  }

  const updateJobAlert = async (item) => {
    try {
      const payload = {
        accessToken,
        updateJobAlertData: {
          email: item.email,
          id: item.id,
          frequency_id: item.frequency_id
        }
      }
      await updateJobAlertService(payload)
      await getAlertsListRequest()
      setOpen(false)
      setCurrentJobAlert(null)
    } catch (error) {
      handleError(error)
    }
  }

  const handelBackToJobSearch = () => {
    router.push('/jobs-hiring/job-search')
  }

  const filterValues = (item) => {
    const keyword = item.keyword_value ? item.keyword_value + ', ' : ''
    return keyword + item.filters
  }

  const handleEditJobAlert = (item) => {
    if (item) {
      setOpen(true)
      setCurrentJobAlert(item)
    }
  }

  const handleDeleteJobAlert = (item) => {
    if (item) {
      setOpenDelete(true)
      setCurrentJobAlert(item)
    }
  }

  const handleSettingSave = (item) => {
    if (item) {
      updateJobAlert(item)
    }
  }

  const handleSettingClose = () => {
    setCurrentJobAlert(null)
    setOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (currentJobAlert?.id) {
      deleteJobAlert(currentJobAlert.id)
    }
  }

  const handleDeleteClose = () => {
    setCurrentJobAlert(null)
    setOpenDelete(false)
  }

  const Empty = () => {
    return (
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
    )
  }

  const JobAlertCard = ({ item }) => {
    return (
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
    )
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
            {jobAlertList.length > 0 ? (
              jobAlertList.map((item) => <JobAlertCard key={item.id} item={item} />)
            ) : (
              <Empty />
            )}
          </>
        )}

        <SettingModal
          key={'Job-Alert-Setting' + currentJobAlert?.id}
          title={accountSetting?.modals?.verifyJobAlertTitle}
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
          cancel={accountSetting?.cancel}
          confirm={accountSetting?.yes}
          handleSave={handleDeleteConfirm}
          handleClose={handleDeleteClose}
          title={accountSetting?.modals?.verifyJobAlertTitle}
          lang={lang}
        >
          <div className={styles.modal}>{accountSetting?.modals?.deleteAlertTip}</div>
        </Modal>
      </div>
    </div>
  )
}

export default AlertJobs
