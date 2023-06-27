import React, { useState, useRef, useContext } from 'react'

/* Vendors */
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share'

/* Components */
import Modal from 'components/Modal'
import Text from 'components/Text'

/* Service */
import { fetchUserShare } from 'store/services/users/share'

/* Styles */
import styles from './ModalShare.module.scss'

/* Images */
import { FacebookIcon, LinkedinIcon, TwitterIcon, CopyIcon } from 'images'
import { useSelector } from 'react-redux'
import { languageContext } from 'app/components/providers/languageProvider'

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
  const {
    jobDetail: { shareModal }
  } = useContext(languageContext) as any
  const jobLinkRef = useRef(null)
  const [isDoneCopy, setIsDoneCopy] = useState(false)
  // this share feature is no needed login, but it's better if user login
  const meInfo = useSelector((store: any) => store.users.fetchUserOwnDetail.response)

  jobDetailUrl = `${location.origin}${jobDetailUrl}`

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link)
    setIsDoneCopy(true)
    setTimeout(() => {
      setIsDoneCopy(false)
    }, 5000)
  }

  const tokenData = () => {
    if (!meInfo.id) {
      return
    }
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
      headerTitle={shareModal.title}
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
              <Text textStyle='base'>{shareModal.facebook}</Text>
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
                {shareModal.twitter}
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
                {shareModal.linkedin}
              </Text>
            </LinkedinShareButton>
          </div>
        </div>
        <div className={styles.ModalShareFooter} onClick={tokenData}>
          <Text textStyle='lg'> {shareModal.link}</Text>
          {isDoneCopy ? (
            <div className={styles.ModalShareFooterTooltip}>
              <Text textStyle='sm' textColor='white'>
                {shareModal.linkCopied}
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
