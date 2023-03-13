import React from "react";
import styles from './company.module.scss';
import CompanyCardList from "./companyList";
import { fetchCompanyTopService } from '../../../store/services/companies/fetchCompanyTop';
import Link from 'next/link';
async function getCompanyData(location) {
  const res = await fetchCompanyTopService(location);
  return res.data;
}

export default async function Companies({ location }: any) {
  const data: any = await getCompanyData(location);
  return (
    <div className={styles.companies}>
      <h2>Top Companies</h2>
      <div className={styles.companyContainer}>
        <CompanyCardList data={data} />
      </div>
      {
        data?.data?.featured_companies?.length ? <Link href='/companies' className={styles.moreBtn}>See More</Link> : null
      }
    </div>
  )
}

