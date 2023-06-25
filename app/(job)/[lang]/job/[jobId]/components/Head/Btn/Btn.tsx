'use client'
import { useState, useEffect, useContext } from 'react'
import { useDispatch } from 'react-redux'

import { Stack } from 'app/components/MUIs'
import MaterialButton from 'components/MaterialButton'
import { FavoriteBorderIcon, FavoriteIcon } from 'app/components/MuiIcons'

import useChatNow from 'app/models/hooks/useChatNow'

import { getCookie } from 'helpers/cookies'
import { getApplyJobLink } from 'helpers/jobPayloadFormatter'

import { postSaveJobService } from 'store/services/jobs/postSaveJob'
import { deleteSaveJobService } from 'store/services/jobs/deleteSaveJob'

import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { languageContext } from 'app/components/providers/languageProvider'
import { LoginModalContext } from 'app/components/providers/loginModalProvider'

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
  const { jobDetail: translation } = useContext(languageContext) as any
  const { header } = translation
  const accessToken = getCookie('accessToken')
  const [loading, chatNow, changeJobModal] = useChatNow(jobDetail)
  const { status_key } = jobDetail
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [isSave, setIsSave] = useState<boolean>(is_saved)
  const { setShowLogin } = useContext(LoginModalContext)
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
      ; (headNode as HTMLElement).style.boxShadow = '10px 5px 5px rgba(217,217,217, 0.6)'
    } else {
      ; (headNode as HTMLElement).style.boxShadow = 'unset'
    }
  }

  const handleSaveJob = () => {
    setSaveLoading(true)

    postSaveJobService({
      // job_title_id: null,
      job_id: jobId
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

    deleteSaveJobService(jobId)
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

  const handleBtnEvent = () => {
    if (jobDetail?.external_apply_url) {
      const userCookie = getCookie('user') || null
      const link = getApplyJobLink(jobDetail, userCookie)
      window.open(link)
    } else {
      ; (chatNow as any)(jobDetail)
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
              return header.apply
            } else if (chat?.is_exists) {
              return header.continueChat
            } else {
              return header.chatNow
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
            onClick={() => {
              if (!accessToken) {
                setShowLogin?.(true)
                return
              } else if (!isSave) {
                handleSaveJob?.()
              } else {
                handleUnSaveJob?.()
              }
            }}
            isLoading={saveLoading}
          >
            {isSave ? (
              <>
                <FavoriteIcon sx={{ color: '#136FD3' }} />
                <span style={{ textTransform: 'capitalize', marginLeft: '8px' }}>
                  {header.undoSave}
                </span>
              </>
            ) : (
              <>
                <FavoriteBorderIcon sx={{ color: '#136FD3' }} />
                <span style={{ textTransform: 'capitalize', marginLeft: '8px' }}>
                  {header.save}
                </span>
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
