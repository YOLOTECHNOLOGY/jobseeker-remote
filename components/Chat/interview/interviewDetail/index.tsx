import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import styles from './index.module.scss'
import moment from 'moment'
import { CopyIconHaveTextCopy } from 'images'
import { getValueById } from 'helpers/config/getValueById'

const InterviewDetail = (props: any) => {
  const { data = {}, status, dic } = props
  const dispatch = useDispatch()
  const config = useSelector((store: any) => store?.config?.config?.response)

  console.log({ dic })
  const detailData = useMemo(() => {
    // const location = getValueById(config, data?.job_location, 'location_id')
    const jobLocation = getValueById(config, data?.location_id, 'location_id')
    const jobCountry = getValueById(config, data?.job.job_country_id, 'country_id')

    const jobTitle = `${data?.job_title} - ${data?.location_id ? jobLocation : ''}, ${jobCountry}`
    const base = [
      ...[
        [dic.jobTitleLabel, jobTitle],
        [dic.addressLabel, data?.address],
        [
          dic.timeLabel,
          data.interviewed_at
            ? moment(data.interviewed_at).format('DD MMM YYYY dddd, HH:mm A')
            : '-'
        ],
        [dic.contactPersonLabel, data?.contact_person],
        [dic.contactNumberLabel, data?.contact_person_contact_num],
        [dic.videoLink, data?.video_link],
        [dic.instructions, data?.instruction]
      ],
      ...(status ? [['Status', status]] : [])
    ]
    if (data?.cancelled_reason) {
      base.push([dic.cancelReason, data.cancelled_reason])
    }
    return base
  }, [data, dic])

  const handleCopyVideoViewLink = () => {
    if (data.video_link) {
      navigator?.clipboard
        ?.writeText(data?.video_link)
        .then(() => {
          dispatch(
            displayNotification({
              open: true,
              severity: 'success',
              message: 'Copy successfully'
            })
          )
        })
        .catch(() => {
          dispatch(
            displayNotification({
              open: true,
              severity: 'error',
              message: 'Copy failed'
            })
          )
        })
    }
    // if (data?.video_link && navigator?.clipboard?.writeText(data?.video_link)) {
    //   dispatch(
    //     displayNotification({
    //       open: true,
    //       severity: 'success',
    //       message: 'Copy successfully'
    //     })
    //   )
    // } else {
    //   dispatch(
    //     displayNotification({
    //       open: true,
    //       severity: 'error',
    //       message: 'Copy failed'
    //     })
    //   )
    // }
  }

  return (
    <div className={styles.modalContainer}>
      <div className={styles.formContainer}>
        {detailData.map(([label, content]) => {
          return (
            <div className={styles.detailItemContainer} key={label}>
              {label == dic.videoLink ? (
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
