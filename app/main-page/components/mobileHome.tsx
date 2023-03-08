import React from "react";
import styles from './mobileComponents/index.module.scss';
import JobCard from "./mobileComponents/jobsCard";
import { fetchCompanyTopService }  from '../../../store/services/companies/fetchCompanyTop';
import Link from 'next/link';

async function getCompanyData() {
    const res = await fetchCompanyTopService();
    return res.data;
  }

const mobileHome = async () => {
    const data  = await getCompanyData();
    const comapny = data?.data?.featured_companies || [];
    console.log(comapny,8888)

return (
    <div className={styles.mobileHome}>
       <h2>Top Companies Hiring</h2>
       <div className={styles.hiring}>
            <div className={styles.itemBox}>
             {
                comapny.map( item => {
                    const {id,logo_url,company_url,name,num_of_active_jobs} = item?.company || {}
                    return (
                        <Link href={company_url} className={styles.item} key={id}>
                        <img src={logo_url} alt="name"/>
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
       
       <div className={styles.jobs}>
       <h2>Jobs for You</h2>
        <p className={styles.tips}>Want more accurate matches?
         <span className={styles.started}>Get Started</span>  
        </p>
         <JobCard/>
       </div>
    </div>
   
)

}

export default mobileHome;