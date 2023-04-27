import React from "react";
import styles from 'app/index.module.scss';
import JobCard from "./jobsCard";
import { fetchCompanyTopService } from "store/services/companies/fetchCompanyTop";
import Link from 'next/link';
import Image from 'next/image'
async function getCompanyData(location) {
    const res = await fetchCompanyTopService(location);
    return res.data;
  }

const mobileHome = async ({location}) => {
    const data  = await getCompanyData(location);
    const comapny = data?.data?.featured_companies || [];

  
return (
    <div className={styles.mobileHome}>
      {
        comapny?.length ? (<>
         <h2>Top Companies Hiring</h2>
       <div className={styles.hiring}>
            <div className={styles.itemBox}>
             {
                comapny.map( item => {
                    const {id,logo_url,company_url,name,num_of_active_jobs} = item?.company || {}
                    return (
                        <Link prefetch={false}  href={`${company_url}/jobs`} className={styles.item} key={id}>
                        <Image src={logo_url} alt="name" width={27} height={27}/>
                         <div className={styles.info}>
                            <p className={styles.name}>{name}</p>
                            <p className={styles.num}> {num_of_active_jobs} jobs hiring</p>
                         </div>
                    </Link>
                    ) 
             })
             }
        </div>
       </div>
        </>) : null
      }
      
       
       <div className={styles.jobs}>
       <h2>Jobs for You</h2>
         <JobCard location={location}/>
       </div>
    </div>
)

}

export default mobileHome;