'use client'
import { useState, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Stack } from 'app/[lang]/components/MUIs'
import Avatar from '@mui/material/Avatar'

import ModalShare from 'components/ModalShare'
import ModalReportJob from 'components/ModalReportJob'

import { postReportRequest } from 'store/actions/reports/postReport'
import { initialState } from 'store/reducers/config/fetchConfig'

import { ShareIcon, ReportIcon } from 'images'
import { accessToken as accessTokenKey, getCookie } from 'helpers/cookies'

import styles from '../../../../page.module.scss'
import { languageContext } from 'app/[lang]/components/providers/languageProvider'

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
}

const JobClient = (props: sharePropsType) => {
  const { isLogin } = props
  const { jobDetail } = useContext(languageContext) as any
  const dispatch = useDispatch()
  const [reportJobReasonList, setReportJobReasonList] = useState<Array<any>>(null)

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

  return (
    <>
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
