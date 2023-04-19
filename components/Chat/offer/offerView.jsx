import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'
import { Image } from 'antd'
import { Offerbottom, Offercenter } from 'images'
const OfferView = props => {
  const { offerData, isSent } = props
  return (
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
          Please note that this offer is not binding and is subject to change. There may be some
          additional paperwork and steps required to finalize the offer.
        </div>
      </div>
      {isSent && <Image wrapperClassName={styles.sent} src={Sent} preview={false} />}
      <Image
        src={offerData?.company?.logo_url}
        preview={false}
        wrapperClassName={styles.image}
      />
      <p className={styles.description}>{offerData?.description}</p>
      <Image wrapperClassName={styles.bottomImage} src={Offerbottom} preview={false} />
      <Image wrapperClassName={styles.bottomCenter} src={Offercenter} preview={false} />
    </div>
  )
}
OfferView.propTypes = {
  offerData: PropTypes.object,
  isSent: PropTypes.bool
}

export default OfferView
