import React from 'react'
import styles from '../index.module.scss'
import InterstedCard from './InterstedCard'
import { fetchViewedRcruiters } from 'store/services/jobs/fetchJobsCommunicated'
import { cookies } from 'next/headers'
import Link from 'next/link'
async function getViewedRcruiters(accessToken) {
  const res = await fetchViewedRcruiters({ accessToken })
  return res?.data?.data?.['viewed_profiles'] || []
}

const ViewedMe = async (props: any) => {
  const { lang, config } = props
  const accessToken = cookies().get('accessToken')?.value
  const data = await getViewedRcruiters(accessToken)

  return (
    <>
      {data?.length ? (
        <div className={styles.upload}>
          <div className={styles.header}>{lang?.whoViewedMe}</div>
          <div className={styles.uploadContainer}>
            <div className={styles.interstedBox}>
              {data.map((item) => {
                return <InterstedCard key={item.id} item={item} config={config} />
              })}
            </div>
            <button className={styles.button}>
              <Link prefetch={false} href={'/my-jobs/communicated?type=viewedMe'}>
                {lang?.seeMore}
              </Link>
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
export default ViewedMe
