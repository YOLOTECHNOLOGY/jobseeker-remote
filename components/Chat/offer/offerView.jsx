import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'
import { Image } from 'antd'
import { Offerbottom, Offercenter, Offerbackground } from 'images'
const OfferView = props => {
  const { offerData, isSent, lang ,onChatClick} = props
  const { pleaseNoteThatThisOffer } = lang
  return (
    <div className={styles.offerContent}>
      <Image
        wrapperClassName={styles.background}
        src={Offerbackground}
        preview={false}
      />
      <div className={styles.offerview}>
        <div className={styles.topInfo}>
          <div className={styles.logo}>
            <svg
              width="19"
              height="20"
              viewBox="0 0 19 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.58333 5.41536H10.4167V7.2487H8.58333V5.41536ZM8.58333 9.08203H10.4167V14.582H8.58333V9.08203ZM9.49999 0.832031C4.43999 0.832031 0.333328 4.9387 0.333328 9.9987C0.333328 15.0587 4.43999 19.1654 9.49999 19.1654C14.56 19.1654 18.6667 15.0587 18.6667 9.9987C18.6667 4.9387 14.56 0.832031 9.49999 0.832031ZM9.49999 17.332C5.45749 17.332 2.16666 14.0412 2.16666 9.9987C2.16666 5.9562 5.45749 2.66536 9.49999 2.66536C13.5425 2.66536 16.8333 5.9562 16.8333 9.9987C16.8333 14.0412 13.5425 17.332 9.49999 17.332Z"
                fill="#136FD3"
              />
            </svg>
          </div>
          <div className={styles.content}>
            {pleaseNoteThatThisOffer}
          </div>
        </div>
        {isSent && <Image wrapperClassName={styles.sent} src={Sent} preview={false} />}
        <Image
          src={offerData?.company?.logo_url}
          preview={false}
          wrapperClassName={styles.image}
        />
        <div className={styles.companyName}>{offerData?.company_name}</div>
        <p className={styles.description}>{offerData?.description}
        </p>
        <div className={styles.recruiterContainer} onClick={onChatClick}>
          <div className={styles.left}>
            <Image
              src={offerData?.recruiter?.avatar}
              preview={false}
              wrapperClassName={styles.image}
            />
            <div
              className={styles.content}
            >
              <div className={styles.label}>{lang.offerSent}</div>
              <div className={styles.title}> {offerData?.recruiter?.full_name}</div>
            </div>
          </div>
          <div className={styles.chatLogo}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.67708 19.1185C1.18664 16.6039 0.665302 13.6318 1.21094 10.76C1.75658 7.8883 3.33167 5.31446 5.64051 3.52174C7.94936 1.72901 10.8332 0.840677 13.7506 1.02351C16.668 1.20634 19.4183 2.44777 21.4853 4.51473C23.5522 6.58169 24.7937 9.33203 24.9765 12.2494C25.1593 15.1668 24.271 18.0506 22.4783 20.3595C20.6855 22.6683 18.1117 24.2434 15.24 24.7891C12.3682 25.3347 9.39606 24.8134 6.88145 23.3229L2.72713 24.4991C2.55693 24.5489 2.37647 24.552 2.20466 24.5081C2.03286 24.4641 1.87604 24.3748 1.75064 24.2494C1.62525 24.124 1.53589 23.9671 1.49195 23.7953C1.448 23.6235 1.45108 23.4431 1.50086 23.2729L2.67708 19.1185Z" fill="white" stroke="#136FD3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14.4562 12.9913C14.4562 13.7861 13.812 14.4304 13.0172 14.4304C12.2224 14.4304 11.5781 13.7861 11.5781 12.9913C11.5781 12.1965 12.2224 11.5522 13.0172 11.5522C13.812 11.5522 14.4562 12.1965 14.4562 12.9913Z" fill="#136FD3" stroke="#136FD3" strokeWidth="0.125" />
              <path d="M8.45039 12.9913C8.45039 13.7861 7.8061 14.4304 7.01133 14.4304C6.21656 14.4304 5.57227 13.7861 5.57227 12.9913C5.57227 12.1965 6.21656 11.5522 7.01133 11.5522C7.8061 11.5522 8.45039 12.1965 8.45039 12.9913Z" fill="#136FD3" stroke="#136FD3" strokeWidth="0.125" />
              <path d="M20.4602 12.9886C20.4602 13.7834 19.8159 14.4277 19.0211 14.4277C18.2263 14.4277 17.582 13.7834 17.582 12.9886C17.582 12.1939 18.2263 11.5496 19.0211 11.5496C19.8159 11.5496 20.4602 12.1939 20.4602 12.9886Z" fill="#136FD3" stroke="#136FD3" strokeWidth="0.125" />
            </svg>

          </div>
         
        </div>
        <Image wrapperClassName={styles.bottomImage} src={Offerbottom} preview={false} />
        <Image wrapperClassName={styles.bottomCenter} src={Offercenter} preview={false} />

      </div>
    </div>
  )
}
OfferView.propTypes = {
  offerData: PropTypes.object,
  isSent: PropTypes.bool,
  lang: PropTypes.object,
  onChatClick:PropTypes.func
}

export default OfferView
