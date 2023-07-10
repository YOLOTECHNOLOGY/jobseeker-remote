'use client'
import { useState, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Stack } from 'app/components/MUIs'
import Avatar from '@mui/material/Avatar'

import ModalShare from 'components/ModalShare'
import ModalReportJob from 'components/ModalReportJob'

import { postReportRequest } from 'store/actions/reports/postReport'
import { initialState } from 'store/reducers/config/fetchConfig'

import { ShareIcon, ReportIcon } from 'images'
import { accessToken as accessTokenKey, getCookie } from 'helpers/cookies'

import styles from '../../../../page.module.scss'
import { languageContext } from 'app/components/providers/languageProvider'
import { FavoriteBorderIcon, FavoriteIcon } from 'app/components/MuiIcons'
import { LoginModalContext } from 'app/components/providers/loginModalProvider'
import { postSaveJobService } from 'store/services/jobs/postSaveJob'
import { deleteSaveJobService } from 'store/services/jobs/deleteSaveJob'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
export type sharePropsType = {
  id: number
  job_url: string
  recruiter: {
    id: number
  }
  company: {
    id: number
  }
  isLogin?: boolean
  is_saved: boolean
}

const JobClient = (props: sharePropsType) => {
  const { isLogin, is_saved, id } = props
  const accessToken = getCookie('accessToken')
  const { jobDetail } = useContext(languageContext) as any
  const { header } = jobDetail
  const dispatch = useDispatch()
  const { setShowLogin } = useContext(LoginModalContext)
  const [reportJobReasonList, setReportJobReasonList] = useState<Array<any>>(null)
  const [isSave, setIsSave] = useState<boolean>(is_saved)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const config = useSelector(
    (store: any) => store?.config?.config?.response ?? initialState.response
  )

  useEffect(() => {
    setReportJobReasonList(config?.report_job_reasons ?? initialState.response.report_job_reasons)
  }, [config])

  const isPostingReport = useSelector((store: any) => store.reports.postReport.fetching)
  const postReportResponse = useSelector((store: any) => store.reports.postReport.response)

  const [isShowSearch, setIsShowSearch] = useState<boolean>(false)
  const [isShowReportJob, setIsShowReportJob] = useState<boolean>(false)

  const handlePostReportJob = (reportJobData) => {
    const accessToken = getCookie(accessTokenKey)
    const postReportJobPayload = {
      reportJobData,
      accessToken
    }

    dispatch(postReportRequest(postReportJobPayload))
  }

  const handleSaveJob = () => {
    setSaveLoading(true)

    postSaveJobService({
      // job_title_id: null,
      job_id: id
    })
      .then(() => {
        setIsSave(true)
      })
      .catch(({ response: { data } }) => {
        dispatch(
          displayNotification({
            open: true,
            message: data.message ? data.message : 'Save job fail',
            severity: 'error'
          })
        )
      })
      .finally(() => {
        setSaveLoading(false)
      })
  }

  const handleUnSaveJob = () => {
    setSaveLoading(true)

    deleteSaveJobService(id)
      .then(() => {
        setIsSave(false)
      })
      .catch((error) => {
        dispatch(
          displayNotification({
            open: true,
            message: error.message ? error.message : 'UnSave job fail',
            severity: 'error'
          })
        )
      })
      .finally(() => {
        setSaveLoading(false)
      })
  }

  return (
    <>
      <span
        className={styles.item}
        onClick={() => {
          if (!accessToken) {
            sessionStorage.setItem('redirectPage', window?.location?.pathname)
            setShowLogin?.(true)
            return
          } else if (!isSave) {
            handleSaveJob?.()
          } else {
            handleUnSaveJob?.()
          }
        }}
      >
        {is_saved ? (
          <>
            <FavoriteIcon sx={{ color: '#136FD3', fontSize: '18px' }} />
            <span style={{ textTransform: 'capitalize', marginLeft: '2px' }}>
              {header.undoSave}
            </span>
          </>
        ) : (
          <>
            <FavoriteBorderIcon sx={{ fontSize: '18px' }} />
            <span style={{ textTransform: 'capitalize', marginLeft: '2px' }}>{header.save}</span>
          </>
        )}
      </span>
      {reportJobReasonList?.length ? (
        <Stack direction='row' spacing={2}>
          <div onClick={() => setIsShowSearch(true)} className={styles.jobClient_btn_wrapper}>
            <Avatar
              src={ShareIcon}
              alt='share'
              sx={{ width: '17px', height: '17px', marginRight: '4px' }}
            />
            {jobDetail.content.jobShare}
          </div>
          {isLogin && (
            <div onClick={() => setIsShowReportJob(true)} className={styles.jobClient_btn_wrapper}>
              <Avatar
                src={ReportIcon}
                alt='report'
                sx={{ width: '17px', height: '17px', marginRight: '4px' }}
              />
              {jobDetail.content.report}
            </div>
          )}
        </Stack>
      ) : null}

      <ModalShare
        selectedJob={props}
        jobDetailUrl={props?.job_url}
        isShowModalShare={isShowSearch}
        handleShowModalShare={setIsShowSearch}
      />

      {isShowReportJob && reportJobReasonList.length && (
        <ModalReportJob
          isShowReportJob={isShowReportJob}
          handleShowReportJob={setIsShowReportJob}
          reportJobReasonList={reportJobReasonList}
          selectedJobId={props?.['id']}
          handlePostReportJob={handlePostReportJob}
          isPostingReport={isPostingReport}
          postReportResponse={postReportResponse}
        />
      )}
    </>
  )
}

export default JobClient
