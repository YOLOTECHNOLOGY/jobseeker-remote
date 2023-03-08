import React  from "react";
import styles from './company.module.scss';
import CompanyCardList from "./companyList";
import { fetchCompanyTopService }  from '../../../store/services/companies/fetchCompanyTop'
import Link from 'next/link';
async function getCompanyData() {
  const res = await fetchCompanyTopService();
  return res.data;
}

export default async function Companies () {
  const data : any = await getCompanyData();
   console.log(data.data,9999)

    return (
        <div className={styles.companies}>
         <h2>Top Companies</h2>
         <div className={styles.companyContainer}>
           <CompanyCardList data={data}/>
         </div>
         {
          []?.length ? <Link href='/companies' className={styles.moreBtn}>See more</Link>  :null
         }
        </div>
    )
}

