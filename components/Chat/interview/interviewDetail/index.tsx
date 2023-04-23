import React, { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import styles from './index.module.scss'

import { CopyIconHaveTextCopy } from 'images'

const InterviewDetail = (props: any) => {
  const { data = {}, status } = props
  const dispatch = useDispatch()
  console.log(data)
  const detailData = useMemo(() => {
    const base = [
      ...[
        ['Job Title', data?.job_title],
        // ['Job Position', data?.job_location],
        ['Location', data?.address],
        ['Date,Time', data.interviewed_at],
        ['Contact person', data?.contact_person],
        ['Contact number', data?.contact_person_contact_num],
        ['Video link', data?.video_link],
        ['Instructions', data?.instruction]
      ],
      ...(status ? [['Status', status]] : [])
    ]
    if (data?.cancelled_reason) {
      base.push(['Cancel reason', data.cancelled_reason])
    }
    return base
  }, [data])

  const handleCopyVideoViewLink = () => {
    if (data?.video_link && navigator?.clipboard?.writeText(data?.video_link)) {
      dispatch(
        displayNotification({
          open: true,
          severity: 'success',
          message: 'Copy successfully'
        })
      )
    } else {
      dispatch(
        displayNotification({
          open: true,
          severity: 'error',
          message: 'Copy failed'
        })
      )
    }
  }

  return (
    <div className={styles.modalContainer}>
      <div className={styles.formContainer}>
        {detailData.map(([label, content]) => {
          return (
            <div className={styles.detailItemContainer} key={label}>
              {label == 'Video link' ? (
                <>
                  {content && (
                    <>
                      <label>{label}</label>
                      <div style={{ marginBottom: 15 }}>
                        <a
                          href={content}
                          target='_blank'
                          style={{ color: '#353535', borderBottom: '1px solid #353535' }}
                          rel='noreferrer'
                        >
                          {content}
                        </a>
                        <span className={styles.copyIcon}>
                          <img
                            src={CopyIconHaveTextCopy}
                            alt='copy icon'
                            onClick={handleCopyVideoViewLink}
                            width={50}
                          />
                        </span>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <label>{label}</label>
                  <p>{content}</p>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InterviewDetail
