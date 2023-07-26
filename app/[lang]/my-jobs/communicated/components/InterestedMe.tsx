import React from 'react'
import styles from '../index.module.scss'
import InterstedCard from './InterstedCard'
import { fetchRecruiters } from 'store/services/jobs/fetchJobsCommunicated'
import { cookies } from 'next/headers'
import Link from 'next/link'

async function getRecurites(accessToken) {
  const res = await fetchRecruiters({ accessToken })
  return res?.data?.data?.['saved_candidates'] || []
}
const Interested = async (props) => {
  const { lang, config } = props
  const accessToken = cookies().get('accessToken')?.value
  const data = await getRecurites(accessToken)
  return (
    <>
      {data?.length ? (
        <div className={styles.upload}>
          <div className={styles.header}>{lang?.InterestedInMe}</div>
          <div className={styles.uploadContainer}>
            <div className={styles.interstedBox}>
              {data.map((item) => {
                return <InterstedCard key={item.id} item={item} config={config} />
              })}
            </div>

            <button className={styles.button}>
              <Link prefetch={true} href={'/my-jobs/communicated?type=interested'}>
                {lang?.seeMore}
              </Link>
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
export default Interested
