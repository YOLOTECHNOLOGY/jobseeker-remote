
import React from "react";
import styles from '../index.module.scss';
import InterstedCard from "./InterstedCard";
import { fetchRecruiters } from 'store/services/jobs/fetchJobsCommunicated'
import { cookies } from 'next/headers';
import Link from 'next/link';

async function getRecurites(accessToken) {
     const res = await fetchRecruiters({ accessToken });
     return res?.data?.data?.['saved_candidates'] || [];
}
const Interested = async () => {
     const accessToken = cookies().get('accessToken')?.value
     const data = await getRecurites(accessToken);
     return (
          <>
               {
                    data?.length && (
                         <div className={styles.upload}>
                              <div className={styles.header}>
                                   Interested in me
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
                                      <Link prefetch={false} href={"/communicated?type=interested"} >See More </Link>
                                      </button>
                                 
                              </div>
                         </div>
                    )
               }
                 </>
       )
        
}
export default Interested;