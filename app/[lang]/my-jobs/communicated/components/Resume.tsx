'use client'
import React, { useEffect } from 'react'
import styles from '../index.module.scss'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useSelector, useDispatch } from 'react-redux'
import {
  updateNoticePeriod,
  fetchDeleteResumes,
  fetchPersonalInfo
} from 'store/services/jobs/fetchJobsCommunicated'
import { getCookie } from 'helpers/cookies'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import Link from 'next/link'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { useSearchParams } from 'next/navigation'
import moment from 'moment'
import { getValueById } from 'helpers/config/getValueById'
import Image from 'next/image'
import classNames from 'classnames'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const Resume = (props: any) => {
  const { resumes, lang, dictionary } = props
  const {
    yearsOld,
    availability,
    editOnlineResume,
    communicated,
    exchanged,
    saved,
    Interview,
    viewed,
    noResumeUploadNow,
    uploadResume,
    availabilityUpdateSuccessfully,
    uploadedResumes,
    deleteSuccess
  } = lang || {}

  const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail?.response ?? {})
  const config = useSelector((store: any) => store.config.config.response)
  const notice_period_lists = config.notice_period_lists || []
  const {
    xp_lvl: xpLvl,
    xp_lvl_id,
    full_name: fullName,
    notice_period_id: noticePeriodId,
    avatar,
    birthdate,
    educations
  } = userDetail
  const [noticePeriodData, setNoticePeriodData] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [message, setMessgae] = React.useState(availabilityUpdateSuccessfully)
  const [resumeData, setResumeData] = React.useState([])
  const dispatch = useDispatch()
  const [jobData, setJobTotal] = React.useState({
    no_of_applied_jobs: 0,
    no_of_chats: 0,
    no_of_interviews: 0,
    no_of_saved_jobs: 0,
    no_of_viewed_jobs: 0
  })
  const accessToken = getCookie('accessToken')
  const searchParams = useSearchParams()
  const searchType = searchParams.get('unsaveId') || ''

  useEffect(() => {
    getPersonalInfo()
  }, [searchType])

  useEffect(() => {
    if (resumes?.length) {
      setResumeData(resumes)
    }
  }, [resumes])

  useEffect(() => {
    if (noticePeriodId) {
      setNoticePeriodData(noticePeriodId)
    }
  }, [noticePeriodId])

  const getPersonalInfo = () => {
    fetchPersonalInfo({ accessToken }).then((res) => {
      const data = res?.data?.data || {}
      setJobTotal(data)
    })
  }

  const handleChange = (event: SelectChangeEvent) => {
    setNoticePeriodData(event.target.value as string)
    changeNoticePeriod(event.target.value)
  }

  const ageFun = (birthdate) => {
    const now = moment(new Date())
    const then = moment(birthdate).format('YYYY-MM-DD')
    const age = now.diff(moment(then), 'years')
    // return new Date().getFullYear() - new Date(birthdate).getFullYear();
    return age
  }
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const deleteResume = (e, index) => {
    fetchDeleteResumes({
      id: e.id,
      accessToken
    })
      .then((res) => {
        if (res.data?.data) {
          resumeData.splice(index, 1)
          setResumeData([...resumeData])
          setMessgae(deleteSuccess)
          setOpen(true)
        }
      })
      .catch((err) => {
        dispatch(
          displayNotification({
            open: true,
            severity: 'error',
            message: dictionary.errorcode[err?.response?.data?.code] || err?.response?.data?.message
          })
        )
      })
  }

  const changeNoticePeriod = (id) => {
    updateNoticePeriod({
      id,
      accessToken
    }).then((res) => {
      if (res.data?.data) {
        setMessgae(availabilityUpdateSuccessfully)
        setOpen(true)
        getUserInfo()
      }
    })
  }

  const {
    no_of_applied_jobs: noOfAppliedJobs,
    no_of_chats: noOfChats,
    no_of_interviews: noOfInterviews,
    no_of_saved_jobs: noOfSavedJobs,
    no_of_viewed_jobs: noOfViewedJobs
  } = jobData || {}

  const VIf = (props) => {
    return props.show ? props.children : null
  }

  const getUserInfo = () => {
    dispatch(fetchUserOwnDetailRequest({ accessToken }))
  }

  return (
    <>
      <div className={styles.resumeContainer}>
        <div className={styles.resume}>
          <div className={styles.user}>
            {!userDetail?.vip?.is_vip ? <Image src={avatar} width={60} height={60} alt='avatar' /> :
              <div className={styles.vipAvatar}>
                <Image
                  src={require('./vip_user_icon.png').default.src}
                  alt=""
                  width={26}
                  height={10}
                  style={{ position: 'absolute', bottom: '-2px', right: 0, borderRadius: 0 }}
                />
                <Image src={avatar} width={60} height={60} alt='avatar' />
              </div>}
            <VIf show={fullName || birthdate || xpLvl || educations?.length > 0}>
              <div className={styles.info}>
                <p>{fullName}</p>
                <div>
                  {birthdate ? (
                    <span>
                      {ageFun(birthdate)} {yearsOld}
                    </span>
                  ) : null}
                  {/*  lvl */}
                  {birthdate && xpLvl ? <i>|</i> : null}
                  <span> {getValueById(config, xp_lvl_id, 'xp_lvl_id')}</span>
                  {/* educations */}
                  {(xpLvl || birthdate) && educations?.[0]?.field_of_study ? <i>|</i> : null}
                  <span> {educations?.[0]?.field_of_study}</span>
                </div>
              </div>
            </VIf>
          </div>
          <Box sx={{ minWidth: 120 }} className={styles.noticeSelect}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>{availability}</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={noticePeriodData}
                label={availability}
                sx={{
                  '> .MuiSelect-select': {
                    padding: '10px 14px'
                  }
                }}
                onChange={handleChange}
              >
                {notice_period_lists.map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <button className={styles.button}>
            <Link href='/manage-profile?tab=profile' prefetch={true}>
              {editOnlineResume}
            </Link>
          </button>
        </div>
        <ul className={styles.type}>
          <li>
            <Link href={'/my-jobs/communicated'}>
              {communicated} ( {noOfChats} )
            </Link>
          </li>
          <li>
            <Link href={'/my-jobs/communicated?type=exchanged'}>
              {exchanged} ( {noOfAppliedJobs} )
            </Link>
          </li>
          <li>
            <Link href={'/my-jobs/communicated?type=saved'}>
              {saved} ( {noOfSavedJobs} )
            </Link>
          </li>
          <li>
            <Link href={'/my-jobs/communicated?type=interview'}>
              {Interview} ( {noOfInterviews} )
            </Link>
          </li>
          <li>
            <Link href={'/my-jobs/communicated?type=viewed'}>
              {viewed} ( {noOfViewedJobs} )
            </Link>
          </li>
        </ul>
      </div>

      {/* <UploadResumeButton classNames={styles.uploadResumeBtn} lang={lang} /> */}

      <div className={classNames([styles.upload, styles.uploadResume])}>
        <div className={styles.header}>{uploadedResumes}</div>
        <div className={styles.uploadContainer}>
          {resumeData?.length ? (
            <ul>
              {resumeData?.map((e, index) => (
                <li key={e.id}>
                  <Link href={e.url}>{e.name}</Link>
                  {resumeData?.length > 1 ? (
                    <DeleteForeverOutlinedIcon
                      onClick={() => deleteResume(e, index)}
                      className={styles.deleteIcoc}
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noMore}>{noResumeUploadNow}!</p>
          )}

          {!(resumeData?.length >= 3) && (
            <button disabled={resumeData?.length >= 3} className={styles.button}>
              <Link href='/manage-profile?tab=resume'>{uploadResume}</Link>
            </button>
          )}
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
          {message}!
        </Alert>
      </Snackbar>
    </>
  )
}
export default Resume
