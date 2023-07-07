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
      ;(headNode as HTMLElement).style.boxShadow = '10px 5px 5px rgba(217,217,217, 0.6)'
    } else {
      ;(headNode as HTMLElement).style.boxShadow = 'unset'
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
      ;(chatNow as any)(jobDetail)
    }
  }

  const handleGetChatNowElement = () => {
    return (
      <MaterialButton
        variant='contained'
        sx={{
          background: '#FFFFFF',
          border: '1px solid #136FD3',
          borderRadius: '10px',
          width: '160px',
          lineHeight: '44px',
          height: '44px',
          color: '#2378E5',
          boxShadow: 'none'
        }}
        isLoading={loading as boolean}
        onClick={() => handleBtnEvent()}
      >
        <span style={{ textTransform: 'capitalize' }}>
          <span style={{ paddingRight: '4px', position: 'relative', top: '5px' }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M18.6899 19.7306C17.7133 20.5907 16.5618 21.2539 15.2936 21.6693C14.3462 21.9827 13.3258 22.1503 12.269 22.1503H2.00729C2.00729 22.1503 2 22.1503 2 22.143V12.8725C2 7.24599 6.5624 2.68359 12.1889 2.68359C14.8855 2.68359 17.3416 3.76953 19.1199 5.53327C20.9274 7.32616 22.0425 9.81872 21.9988 12.5664C21.9696 14.3665 21.4522 16.0501 20.5776 17.4859C20.1767 18.1418 19.6957 18.754 19.1564 19.2934C19.01 19.4397 18.8636 19.5728 18.7108 19.7117L18.7108 19.7117L18.6899 19.7306ZM16.4571 13.291C16.7558 13.0041 16.7655 12.5293 16.4786 12.2305C16.1917 11.9318 15.7169 11.9221 15.4181 12.209C14.5897 13.0045 13.3297 13.474 12.0213 13.4958C10.7164 13.5175 9.45537 13.0933 8.59609 12.223C8.30505 11.9283 7.83019 11.9253 7.53545 12.2163C7.2407 12.5074 7.2377 12.9822 7.52873 13.277C8.73488 14.4985 10.4238 15.0226 12.0463 14.9956C13.6653 14.9686 15.3102 14.3923 16.4571 13.291Z'
                fill='#2378E5'
              />
            </svg>
          </span>
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
          {/* <MaterialButton
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
                sessionStorage.setItem('redirectPage',window?.location?.pathname)
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

          </MaterialButton> */}
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
