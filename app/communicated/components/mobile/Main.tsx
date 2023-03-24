"use client"
import styles from './components/index.module.scss';
import JobsCard from './components/JobsCard';
import Image from 'next/image'
import { JoinUs } from 'images'
import Link from 'next/link';
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import CardHeader from '@mui/material/CardHeader';
const MainMobile = (props: any) => {
    console.log(props, 'props')
    const { loadingList, data, tabValue } = props
    return <div>
        {
            !loadingList ? (<>
                {
                    data?.length ? <>
                        {tabValue === 'interview' ? '' : (
                            <div className={styles.communicated}>
                                <JobsCard {...props} />
                            </div>
                        )}
                    </>
                        : <div className={styles.noData}>
                            <Image className={styles.noDataImg} src={JoinUs} alt='暂无数据' width={362} height={247} />
                            <button className={styles.seeJob}>
                                <Link href="/jobs-hiring/manila-jobs?page=1">
                                    See job reco
                                </Link>
                            </button>
                        </div>
                }

            </>) : (
                <Box sx={{ width: '100%' }}>
                    {
                        [1, 2, 3, 4, 5, 6].map((e) => {
                            return (
                                <div key={e}>
                                    <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />
                                    <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />
                                    <CardHeader
                                        avatar={<Skeleton animation="wave" variant="circular" width={30} height={30} />}
                                        title={<Skeleton animation="wave" height={16} width="80%" />}
                                        subheader={<Skeleton animation="wave" height={16} width="40%" />}
                                    />

                                </div>
                            )
                        })
                    }
                </Box>
            )
        }



    </div>

}
export default MainMobile;