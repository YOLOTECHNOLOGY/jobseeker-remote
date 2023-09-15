/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from 'react'
import { PureModal } from 'components/Modal/PrueModal'

import styles from './index.module.scss'
import { recruiterDetail } from 'store/services/recruiters'
import classNames from 'classnames'
import { CircularProgress } from '@mui/material'
import { formatTemplateString } from 'helpers/formatter'
import { getRandomBanner } from './banners'



export const RecruiterModal = (props: { uid: string | number, display: boolean, lang: any, onClose: (show: boolean) => void }) => {
  const { lang, display, onClose, uid } = props
  // debugger
  const { recruiterModal } = lang
  const [show, setShow] = useState(false)
  const [user, setUser] = useState<any>({})
  const [banner, setBanner] = useState('')

  useEffect(() => {
    setShow(Boolean(display))
    setBanner(getRandomBanner())
  }, [display])

  useEffect(() => {
    if (!uid) {
      return
    }
    setUser({})
    let unmounted = false
    recruiterDetail(uid).then(res => {
      const { data } = res?.data || {};
      if (unmounted || !data) {
        return
      }
      setUser(data)
    })

    return () => {
      unmounted = true
    }
  }, [uid])

  const { company, display_badges, full_name, job_title, avatar,
    response_rate_time_defeat_percentile = 0, response_rate = 0 } = user
  const hasProps = Boolean(Object.keys(user).length)

  return <PureModal
    showModal={show}
    handleModal={onClose}
    bodyClass={styles.recruiterModal}
    className={styles.wrapper}
  >
    {hasProps && <>
      {banner && <img src={banner} className={styles.banner} />}
      <div className={styles.detail}>
        <div className={classNames(styles.recruiterModalSection, styles.recruiterBaseInfo)}>
          <div className={styles.row}>
            <img src={avatar} className={styles.userAvatar} />
            <div className={styles.infoWrapper}>
              <div className={styles.userName}>{full_name}</div>
              <div className={styles.jobTitle}>{job_title}</div>
            </div>
          </div>
        </div>

        {Boolean(display_badges?.length) && <div className={classNames(styles.medal, styles.recruiterModalSection)}>
          <div className={styles.title}>
            {/* {t('settings.profileSetting.previewModal.medal')} */}
            {/* medal */}
            {recruiterModal?.medal}
          </div>
          <div className={styles.badgeWrapper}>
            {display_badges.map(v => {
              return (
                <div key={v.id} className={styles.badgeItem}>
                  <img height={76} width={60} src={v.logo} />
                </div>
              )
            })}
          </div>
        </div>}

        {Boolean(company) && (
          <div className={classNames(styles.recruiterModalSection, styles.company)}>
            <div className={styles.title}>
              {/* {t('settings.profileSetting.previewModal.company')} */}
              {/* company */}
              {recruiterModal.company}
            </div>
            <div className={classNames(styles.companyContent, styles.row)}>
              <img src={company.logo_url} className={styles.companyLogo} />
              <div>
                <span className={styles.companyName}>{company.name}</span>
                <div>
                  {['industry', 'company_size'].map(key => {
                    return (
                      <span className={styles.label} key={key}>
                        {company[key]}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
    }

    {
      !hasProps && <div className={styles.loadingWrapper}>
        <CircularProgress />
      </div>
    }
  </PureModal >
}