import React  from "react";
import styles from './company.module.scss';
import CompanyCardList from "./companyList";
import axios from 'axios'

async function getCompanyData() {
  const res = await axios.get('https://dev.api.bossjob.com/companies/featured-companies?page=1&size=10');
  console.log(res,1111)
  return res.data;
}


export default async function Companies (props: any) {
   
  const data : any = await getCompanyData();
  console.log(data.data,9999)
    return (
        <div className={styles.companies}>
         <h2>Top Companies</h2>
         <div className={styles.companyContainer}>
           <CompanyCardList data={data}/>
         </div>
         <div className={styles.moreBtn}>See more</div> 
        </div>
    )
}

