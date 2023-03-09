'use client';
import React from 'react';
import styles from './company.module.scss';
import Link from 'next/link';
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation';

const CompanyList = (props: any) => {
    console.log(props, 999988)
    const router = useRouter();
    const { featured_companies } = props?.data?.data || {}
    console.log(featured_companies, 1111)

    const chatHandle = (item:string) => {
        if(0){

        }else{
            router.push(item)
        }

    }

    return (
        <>
            {
                featured_companies?.map(item => {
                    const { id } = item || {};
                    const { company_url, logo_url, name, industry, company_size, financing_stage, jobs, } = item?.company || {}
                    return (
                        <div className={styles.card} key={id}>
                            <Link className={styles.header} href={company_url}>
                                <img src={logo_url} alt={name}></img>
                                <h5>{name}</h5>
                                <p>
                                    {industry}
                                    {industry && company_size ? ' | ' : null}
                                    {company_size ? `${company_size} Employee` : null}
                                    {(industry || company_size) && financing_stage ? ' | ' : null}
                                    {financing_stage}
                                </p>
                            </Link>
                            {jobs?.map(jobItem => {
                                const { job_title, salary_range_value, job_location, xp_lvl, degree ,job_url} = jobItem || {};
                                return (
                                    <Link  href={job_url} className={styles.list} key={jobItem.id}>
                                        <div className={styles.jobType}>
                                            <p>{job_title}</p>
                                            <div className={styles.salary}>
                                                <span className={styles.num}>{salary_range_value}</span>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    className={styles.chataBtn}
                                                    onClick={()=>chatHandle(job_url)}
                                                >
                                                    Chat now
                                                </Button>
                                            </div>
                                        </div>
                                        <span className={styles.tag}>{job_location}</span>
                                        <span className={styles.tag}>{xp_lvl}</span>
                                        <span className={styles.tag}>{degree}</span>
                                    </Link>
                                )
                            })
                            }
                            <Link href={`${company_url}/jobs`} className={styles.linkAddress}>
                                More jobs
                            </Link>
                        </div>
                    )
                })
            }
        </>

    )

};

export default CompanyList