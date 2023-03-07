'use client';
import React from 'react';
import styles from './company.module.scss';
import Link from 'next/link';
import { Button ,Icon } from '@mui/material'
import { useRouter } from 'next/navigation';

const CompanyList = (props: any) => {
    console.log(props,999988)
    const router = useRouter();
    const {featured_companies} = props?.data?.data || {}
    console.log(featured_companies,1111)
    return (
        <>
        {
            featured_companies?.map(item =>{
                const { id , priority } =  item || {};
                 const {company_url,logo_url,name,industry,company_size} = item?.company || {}
                return (
                    <div className={styles.card}>
                <div className={styles.header} onClick={() => router.push(`/company/isupport-worldwide-${id}/jobs`)}>
                    <img src={logo_url} alt={name}></img>
                    <h5>{name}</h5>
                    <p>{industry} 
                    { industry &&  company_size ? ' | ' : null} 
                    {company_size ? `${company_size} Employee`  : null} 
                    {(industry || company_size) && priority ? ' | ' : null} 
                    Pre-A
                     </p>
                </div>
                <div className={styles.list}>
                    <div className={styles.jobType}>
                        <p>Java Developerava Developeava Developeava Developeava Developeava Develope</p>
                        <div className={styles.salary}>
                            <span className={styles.num}>₱175 - 180K</span>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={styles.chataBtn}
                            >
                            Chat now
                          </Button>
                        </div>
                    </div>
                    <span className={styles.tag}>3 -  5 Exp Yrs</span> 
                    <span className={styles.tag}>3 -  5 Exp Yrs</span>
                    <span className={styles.tag}>3 -  5 Exp Yrs</span>
                </div>
                <div className={styles.list}>
                    <div className={styles.jobType}>
                        <p>Java Developerava Developeava Developeava Developeava Developeava Develope</p>
                        <div className={styles.salary}>
                            <span className={styles.num}>₱175 - 180K</span>
                            <Button
                               variant="contained"
                                color="primary"
                                size="small"
                                className={styles.chataBtn}
                            >
                            Chat now
                          </Button>
                        </div>
                    </div>
                    <span className={styles.tag}>3 -  5 Exp Yrs</span> 
                    <span className={styles.tag}>3 -  5 Exp Yrs</span>
                    <span className={styles.tag}>3 -  5 Exp Yrs</span>
                </div>
                <div className={styles.list}>
                    <div className={styles.jobType}>
                        <p>Java Developerava Developeava Developeava Developeava Developeava Develope</p>
                        <div className={styles.salary}>₱175 - 180K</div>
                    </div>
                    <span className={styles.tag}>3 -  5 Exp Yrs</span> 
                    <span className={styles.tag}>3 -  5 Exp Yrs</span>
                    <span className={styles.tag}>3 -  5 Exp Yrs</span>
                </div>
                <Link href={`/company/isupport-worldwide-${id}/jobs`} className={styles.linkAddress}>
                More jobs
               </Link>
            </div>
                )

         })
        }
         {/* <div className={styles.card}>
                <div className={styles.header}>
                    <img src='https://th.bing.com/th?id=OSK.c134d3d5d912b9a40e980d3f19804189&w=80&h=80&c=12&o=6&dpr=2&pid=SANGAM'></img>
                    <h5>Dempsey Resources</h5>
                    <p>Information Technology | 10 - 50 Employee | Pre-A </p>
                </div>
                <div className={styles.list}>
                    <div className={styles.jobType}>
                        <p>Java Developerava Developeava Developeava Developeava Developeava Develope</p>
                        <div className={styles.salary}>
                            <span className={styles.num}>₱175 - 180K</span>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={styles.chataBtn}
                            >
                            Chat now
                          </Button>
                        </div>
                    </div>
                    <span className={styles.tag}>3 -  5 Exp Yrs</span> 
                    <span className={styles.tag}>3 -  5 Exp Yrs</span>
                    <span className={styles.tag}>3 -  5 Exp Yrs</span>
                </div>
                <div className={styles.list}>
                    <div className={styles.jobType}>
                        <p>Java Developerava Developeava Developeava Developeava Developeava Develope</p>
                        <div className={styles.salary}>
                            <span className={styles.num}>₱175 - 180K</span>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={styles.chataBtn}
                            >
                            Chat now
                          </Button>
                        </div>
                    </div>
                    <span className={styles.tag}>3 -  5 Exp Yrs</span> 
                    <span className={styles.tag}>3 -  5 Exp Yrs</span>
                    <span className={styles.tag}>3 -  5 Exp Yrs</span>
                </div>
                <div className={styles.list}>
                    <div className={styles.jobType}>
                        <p>Java Developerava Developeava Developeava Developeava Developeava Develope</p>
                        <div className={styles.salary}>₱175 - 180K</div>
                    </div>
                    <span className={styles.tag}>3 -  5 Exp Yrs</span> 
                    <span className={styles.tag}>3 -  5 Exp Yrs</span>
                    <span className={styles.tag}>3 -  5 Exp Yrs</span>
                </div>
                <Link href="/blog/hello-world" className={styles.linkAddress}>
                More jobs
               </Link>
            </div> */}

        </>

    )

};

export default CompanyList