import React, { useState, useRef } from 'react'

/* Vendors */
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share'

/* Components */
import Modal from 'components/Modal'
import Text from 'components/Text'

/* Styles */
import styles from './ModalShare.module.scss'

/* Images */
import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  CopyIcon
} from 'images'

interface ModalShareProps {
  jobDetailUrl?: string
  isShowModalShare?: boolean
  handleShowModalShare?: Function
}

const ModalShare = ({ jobDetailUrl, isShowModalShare, handleShowModalShare }: ModalShareProps) => {
  const [isDoneCopy, setIsDoneCopy] = useState(false)
  const jobLinkRef = useRef(null)

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link)
    setIsDoneCopy(true)
    setTimeout(() => {
      setIsDoneCopy(false)
    }, 5000)
  }

  return (
    <Modal
      headerTitle='Share this job'
      showModal={isShowModalShare}
      handleModal={() => handleShowModalShare(false)}
    >
      <div className={styles.ModalShare}>
        <div className={styles.ModalShareList}>
          <div className={styles.ModalShareItem}>
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
          <div className={styles.ModalShareItem}>
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
          <div className={styles.ModalShareItem}>
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
        <div className={styles.ModalShareFooter}>
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
            <div onClick={() => handleCopyLink(jobDetailUrl)} className={styles.ModalShareFooterCopy}>
              <img src={CopyIcon} alt='close' height='18px' width='18px' />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalShare