'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSearchParams, useRouter } from 'next/navigation'

import { getCookie } from "helpers/cookies"
import { getLang } from 'helpers/country'

import { logoutRequest } from 'store/actions/auth/logout'

import styles from '../index.module.scss'

const VipUserPrompt = () => {
  const accessToken = getCookie('accessToken')
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('referral_code')
  const invitedSource = searchParams.get('invited_source')
  const [promptVisible, setPromptVisible] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const originUrl = window.location.href
  const lang = getLang()

  useEffect(() => {
    if (accessToken != null && referralCode && invitedSource) {
      setPromptVisible(true)
    }
  }, [referralCode, invitedSource, accessToken])

  if (!promptVisible) return null

  return (
    <div className={styles.vipUserPromptWrap}>
      <div className={styles.vipUserPrompt}>
        <p>You are currently logged in, please log out and re-register or log in</p>
        <div className={styles.buttonContent}>
          <Button className={styles.returnButton} onClick={(e) => {
            e.preventDefault()
            router.replace(`/${lang}`)
            setPromptVisible(false)
          }}>
            Return Home
          </Button>
          <Button
            variant="contained"
            className={styles.exitButton}
            onClick={() => {
              dispatch(logoutRequest())
              setPromptVisible(false)
              router.replace(originUrl)
            }}>
            Sign Out
          </Button>
        </div>
      </div>
    </div >
  )
}

export default VipUserPrompt
