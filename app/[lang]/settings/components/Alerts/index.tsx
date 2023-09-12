import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import Loading from 'app/components/loading'
import Text from 'components/Text'
import Modal from '../Modal'
import SettingModal from './SettingModal'
import { formatJobAlertFilter } from './formatJobAlert'
import JobCard from './JobCard'
import Empty from '../Empty'

// actions
import { fetchJobAlertsListService } from 'store/services/alerts/fetchJobAlertsList'
import { updateJobAlertService } from 'store/services/alerts/updateJobAlert'
import { deleteJobAlertService } from 'store/services/alerts/deleteJobAlert'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// styles
import styles from './index.module.scss'
import { formatTemplateString } from 'helpers/formatter'

interface IProps {
  accessToken: string
  lang: any
}

const AlertJobs = (props: IProps) => {
  const { accessToken, lang } = props
  const { accountSetting } = lang
  const errorCode = lang.errorcode || {}

  const dispatch = useDispatch()

  const [open, setOpen] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [jobAlertList, setJobAlertList] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [isUpdateLoading, setIsUpdateLoading] = useState(false)

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
      const errors = Object.values(data?.errors)[0]
      if (errors) {
        errorMessage = errors[0]
      }
    }

    const code = data?.code
    let transErr = errorCode[code]
    if (code === 40006) {
      transErr = formatTemplateString(transErr, {
        retry_after: error?.response?.data?.errors?.retry_after
      })
    }

    dispatch(
      displayNotification({
        open: true,
        message: transErr || errorMessage || data.message,
        severity: 'error'
      })
    )
  }

  const getAlertsListRequest = async () => {
    try {
      setIsLoading(true)
      const list = await fetchJobAlertsListService({ accessToken })
      const resData = list.data.data || []
      setJobAlertList(resData)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleError(error)
    }
  }

  const deleteJobAlert = async (id) => {
    setIsDeleteLoading(true)
    try {
      const payload = {
        accessToken,
        jobAlertId: id
      }
      await deleteJobAlertService(payload)
      setCurrentJobAlert(null)
      setOpenDelete(false)
      setIsDeleteLoading(false)
      await getAlertsListRequest()
    } catch (error) {
      setIsDeleteLoading(false)
      handleError(error)
    }
  }

  const updateJobAlert = async (item) => {
    setIsUpdateLoading(true)
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
      setOpen(false)
      setCurrentJobAlert(null)
      setIsUpdateLoading(false)
      await getAlertsListRequest()
    } catch (error) {
      setIsUpdateLoading(false)
      handleError(error)
    }
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


  function formatJobAlertFilterItem(item) {
    let result = formatJobAlertFilter(config, item)
    let companyVerify = item.is_company_verified == '1' ? 'Verified' : ''
    companyVerify = !companyVerify ? `` : lang.search?.alertModal?.companyVerified
    const searchQuery = item.keyword_value
    result = [searchQuery, ...result, companyVerify]
    return result.filter(Boolean).join(',')
  }

  return (
    <div className={styles.JobAlertContainer}>
      <Text tagName='h2' className={styles.JobAlertTitle}>
        {accountSetting?.tabs?.jobAlert}
      </Text>
      <div className={styles.JobAlertContainer_wrapper}>
        {isLoading && (
          <div className={styles.loading}>
            <Loading />
          </div>
        )}
        {!isLoading && (
          <>
            {jobAlertList.length > 0 ? (
              jobAlertList.map((item) => (
                <JobCard
                  key={item.id}
                  item={item}
                  config={config}
                  lang={lang}
                  filterValues={formatJobAlertFilterItem(item)}
                  handleEditJobAlert={handleEditJobAlert}
                  handleDeleteJobAlert={handleDeleteJobAlert}
                />
              ))
            ) : (
              <Empty lang={lang} style={{marginTop: '62px'}} />
            )}
          </>
        )}
      </div>

      <SettingModal
        key={'Job-Alert-Setting' + currentJobAlert?.id}
        title={accountSetting?.modals?.verifyJobAlertTitle}
        open={open}
        config={config}
        job={currentJobAlert}
        filterValues={formatJobAlertFilterItem}
        handleSave={handleSettingSave}
        handleClose={handleSettingClose}
        isLoading={isUpdateLoading}
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
        isLoading={isDeleteLoading}
        lang={lang}
      >
        <div className={styles.modal}>
          <span className={styles.deleteTip}>{accountSetting?.modals?.deleteAlertTip}</span>
        </div>
      </Modal>
    </div>
  )
}

export default AlertJobs
