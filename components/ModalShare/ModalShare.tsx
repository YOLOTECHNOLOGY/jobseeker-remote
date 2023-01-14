import React, { useState, useRef, useEffect } from 'react'

/* Vendors */
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share'

/* Components */
import Modal from 'components/Modal'
import Text from 'components/Text'

/* Service */
import { fetchUserShare } from 'store/services/users/share'

/* Active */
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'

/* Styles */
import styles from './ModalShare.module.scss'

/* Images */
import { FacebookIcon, LinkedinIcon, TwitterIcon, CopyIcon } from 'images'
import { useDispatch, useSelector } from 'react-redux'

interface ModalShareProps {
  jobDetailUrl?: string
  isShowModalShare?: boolean
  handleShowModalShare?: Function
  selectedJob?: any
}

const ModalShare = ({
  jobDetailUrl,
  isShowModalShare,
  handleShowModalShare,
  selectedJob
}: ModalShareProps) => {
  const jobLinkRef = useRef(null)
  const dispatch = useDispatch()
  const [isDoneCopy, setIsDoneCopy] = useState(false)

  const meInfo = useSelector((store: any) => store.users.fetchUserOwnDetail.response)

  jobDetailUrl = `${process.env.NEW_PROJECT_URL}${jobDetailUrl}`

  useEffect(() => {
    if (meInfo.id) {
      return
    }

    dispatch(fetchUserOwnDetailRequest({}))
  }, [])

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link)
    setIsDoneCopy(true)
    setTimeout(() => {
      setIsDoneCopy(false)
    }, 5000)
  }

  const tokenData = () => {
    const data = {
      jobseeker_id: meInfo.id,
      recruiter_id: selectedJob.recruiter.id,
      company_id: selectedJob.company.id,
      job_id: selectedJob.id
    }

    fetchUserShare(data)
      .then(({ status }: any) => {
        if (status === 200) {
          //
        }
      })
      .catch(() => {
        //
      })
  }

  return (
    <Modal
      headerTitle='Share this job'
      showModal={isShowModalShare}
      handleModal={handleShowModalShare}
    >
      <div className={styles.ModalShare}>
        <div className={styles.ModalShareList}>
          <div className={styles.ModalShareItem} onClick={tokenData}>
            <FacebookShareButton url={jobDetailUrl} className={styles.ModalShareItemLink}>
              <img
                src={FacebookIcon}
                alt='facebook'
                height='56px'
                width='56px'
                className={styles.ModalShareItemImg}
              />
              <Text textStyle='base'>Facebook</Text>
            </FacebookShareButton>
          </div>
          <div className={styles.ModalShareItem} onClick={tokenData}>
            <TwitterShareButton url={jobDetailUrl} className={styles.ModalShareItemLink}>
              <img
                src={TwitterIcon}
                alt='twitter'
                height='56px'
                width='56px'
                className={styles.ModalShareItemImg}
              />
              <Text textStyle='base' textColor='warmgrey'>
                Twitter
              </Text>
            </TwitterShareButton>
          </div>
          <div className={styles.ModalShareItem} onClick={tokenData}>
            <LinkedinShareButton url={jobDetailUrl} className={styles.ModalShareItemLink}>
              <img
                src={LinkedinIcon}
                alt='linkedIn'
                height='56px'
                width='56px'
                className={styles.ModalShareItemImg}
              />
              <Text textStyle='base' textColor='warmgrey'>
                Linkedin
              </Text>
            </LinkedinShareButton>
          </div>
        </div>
        <div className={styles.ModalShareFooter} onClick={tokenData}>
          <Text textStyle='lg'>Page Link</Text>
          {isDoneCopy ? (
            <div className={styles.ModalShareFooterTooltip}>
              <Text textStyle='sm' textColor='white'>
                Link copied
              </Text>
            </div>
          ) : null}
          <div className={styles.ModalShareFooterLink}>
            <input
              value={jobDetailUrl}
              ref={jobLinkRef}
              onClick={() => jobLinkRef.current.select()}
              className={styles.ModalShareFooterLinkText}
              readOnly
            />
            <div
              onClick={() => handleCopyLink(jobDetailUrl)}
              className={styles.ModalShareFooterCopy}
            >
              <img src={CopyIcon} alt='close' height='18px' width='18px' />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalShare
