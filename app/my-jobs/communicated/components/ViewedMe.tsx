
import React from "react";
import styles from '../index.module.scss';
import InterstedCard from "./InterstedCard";
import { fetchViewedRcruiters } from 'store/services/jobs/fetchJobsCommunicated'
import { cookies } from 'next/headers'
import Link from 'next/link';
async function getViewedRcruiters(accessToken) {
     const res = await fetchViewedRcruiters({ accessToken });
     return res?.data?.data?.['viewed_profiles'] || [];
}

const ViewedMe = async () => {
     const accessToken = cookies().get('accessToken')?.value
     const data = await getViewedRcruiters(accessToken);

     return (
          <>
               {data?.length ? (
                    <div className={styles.upload}>
                         <div className={styles.header}>
                              Who viewed me
                         </div>
                         <div className={styles.uploadContainer}>
                              <div className={styles.interstedBox}>
                                   {
                                        data.map(item => {
                                             return <InterstedCard key={item.id} item={item} />
                                        })
                                   }

                              </div>
                              <button className={styles.btn}>
                                      <Link prefetch={false} href={"/my-jobs/communicated?type=viewedMe"} >See More </Link>
                              </button>
                         </div>
                    </div>
               ):null
               }
          </>
     )
}
export default ViewedMe;