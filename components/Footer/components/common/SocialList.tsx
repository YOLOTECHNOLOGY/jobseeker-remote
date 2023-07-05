import React from 'react'
import Link from 'components/Link'
import Image from 'next/image'

import styles from '../../Footer.module.scss'

/* Images */
import {
  footer_facebook_icon,
  footer_linkedIn_icon,
  footer_instagram_icon,
  footer_tiktok_icon,
  footer_youtube_icon,
  footer_twitter_icon
} from 'images'

const SocialList = () => {
  return (
    <>
      <Link
        className={styles.socialLink}
        to='https://www.facebook.com/Bossjobph'
        external
        title='Bossjob Facebook'
      >
        <Image src={footer_facebook_icon} alt='facebook' width={32} height={32} />
      </Link>
      <Link
        className={styles.socialLink}
        to='https://www.linkedin.com/company/bossjob-yolo-technology/'
        external
        title='Bossjob LinkedIn'
      >
        <Image src={footer_linkedIn_icon} alt='linkedin' width={32} height={32} />
      </Link>
      <Link
        className={styles.socialLink}
        to='https://www.instagram.com/Bossjobph'
        external
        title='Bossjob Instagram'
      >
        <Image src={footer_instagram_icon} alt='instagram' width={32} height={32} />
      </Link>
      <Link
        className={styles.socialLink}
        to='https://www.youtube.com/channel/UCszmY1TPgEyikxF9w2a2vdw'
        external
        title='Bossjob Youtube'
      >
        <Image src={footer_youtube_icon} alt='youtube' width={32} height={32} />
      </Link>
      <Link
        className={styles.socialLink}
        to='https://twitter.com/BossjobOfficial'
        external
        title='Bossjob Twitter'
      >
        <Image src={footer_twitter_icon} alt='twitter' width={32} height={32} />
      </Link>
      <Link
        className={styles.socialLink}
        to='https://tiktok.com/@bossjobph'
        external
        title='Bossjob Tiktok'
      >
        <Image src={footer_tiktok_icon} alt='tiktok' width={32} height={32} />
      </Link>
    </>
  )
}

export default SocialList
