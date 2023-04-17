'use client'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Stack } from 'app/components/MUIs'
import MaterialButton from 'components/MaterialButton'
import { FavoriteBorderIcon, FavoriteIcon } from 'app/components/MuiIcons'

import useChatNow from 'app/hooks/useChatNow'

import { getCookie } from 'helpers/cookies'
import { getApplyJobLink } from 'helpers/jobPayloadFormatter'

import { postSaveJobService } from 'store/services/jobs/postSaveJob'
import { deleteSaveJobService } from 'store/services/jobs/deleteSaveJob'

import { displayNotification } from 'store/actions/notificationBar/notificationBar'

type propsType = {
  is_saved: boolean
  chat: any
  jobId: number
  className?: string
  jobDetail: any
}

const Btn = ({ jobId, chat, is_saved, className, jobDetail }: propsType) => {
  const dispatch = useDispatch()
  const userInfo = getCookie('user')

  const [loading, chatNow, changeJobModal] = useChatNow(jobDetail)
  const { status_key } = jobDetail
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [isSave, setIsSave] = useState<boolean>(is_saved)

  useEffect(() => {
    document.addEventListener('scroll', handleAddHeadBoxShadow)

    return () => document.removeEventListener('scroll', handleAddHeadBoxShadow)
  }, [])

  useEffect(() => {
    setIsSave(is_saved)
  }, [is_saved])

  const handleAddHeadBoxShadow = (e) => {
    const scrollTopHeight = document.body.scrollTop || document.documentElement.scrollTop
    const headNode = document.querySelector('#jobDetaiPagelHead')
    if (scrollTopHeight > 55) {
      ;(headNode as HTMLElement).style.boxShadow = '10px 5px 5px rgba(217,217,217, 0.6)'
    } else {
      ;(headNode as HTMLElement).style.boxShadow = 'unset'
    }
  }

  const handleSaveJob = () => {
    setSaveLoading(true)

    postSaveJobService({
      job_title_id: jobId,
      job_id: jobId
    })
      .then(({ status }) => {
        if (status === 201) {
          setIsSave(true)
        }
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

    deleteSaveJobService(jobId)
      .then(({ status }) => {
        if (status === 200) {
          setIsSave(false)
        }
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

  const handleBtnEvent = () => {
    if (jobDetail?.external_apply_url) {
      const userCookie = getCookie('user') || null
      const link = getApplyJobLink(jobDetail, userCookie)
      window.open(link)
    } else {
      ;(chatNow as any)(jobDetail)
    }
  }

  const handleGetChatNowElement = () => {
    return (
      <MaterialButton
        variant='contained'
        sx={{
          maxWidth: '140px',
          lineHeight: '44px',
          height: '44px',
          background: '#136FD3',
          borderRadius: '10px'
        }}
        isLoading={loading as boolean}
        onClick={() => handleBtnEvent()}
      >
        <span style={{ textTransform: 'capitalize' }}>
          {(() => {
            if (jobDetail.external_apply_url) {
              return 'Apply Now'
            } else if (chat?.is_exists && chat?.job_id == jobId) {
              return 'Continue Chat'
            } else {
              return 'Chat Now'
            }
          })()}
        </span>
      </MaterialButton>
    )
  }

  return (
    <>
      {status_key == 'active' ? (
        <Stack spacing={2} direction='row' className={className}>
          <MaterialButton
            variant='outlined'
            sx={{
              height: '44px',
              background: '#FFFFFF',
              border: '1px solid #136FD3',
              borderRadius: '10px',
              paddingLeft: '13px',
              paddingRight: '13px',
              display: 'flex',
              justifyContent: 'space-between',
              textTransform: 'capitalize'
            }}
            onClick={!isSave ? handleSaveJob : handleUnSaveJob}
            isLoading={saveLoading}
          >
            {isSave ? (
              <>
                <FavoriteIcon sx={{ color: '#136FD3' }} />
                <span style={{ textTransform: 'capitalize', marginLeft: '8px' }}>Undo saved</span>
              </>
            ) : (
              <>
                <FavoriteBorderIcon sx={{ color: '#136FD3' }} />
                <span style={{ textTransform: 'capitalize', marginLeft: '8px' }}> Save</span>
              </>
            )}

            {/* <FavoriteBorderIcon sx={{ color: '#136FD3' }} /> */}
          </MaterialButton>
          {userInfo?.id == jobDetail.recruiter?.id
            ? jobDetail.external_apply_url
              ? handleGetChatNowElement()
              : null
            : handleGetChatNowElement()}
        </Stack>
      ) : null}

      {changeJobModal}
    </>
  )
}

export default Btn
