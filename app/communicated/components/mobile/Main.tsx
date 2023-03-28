"use client"
import styles from './components/index.module.scss';
import JobsCard from './components/JobsCard';
import Image from 'next/image'
import { JoinUs } from 'images'
import Link from 'next/link';
const MainMobile = (props: any) => {
    console.log(props, 'props')
    const {data } = props
    return <div>
        {
            data?.length ? <div className={styles.communicated}>  <JobsCard {...props} /></div>
                : <div className={styles.noData}>
                    <Image className={styles.noDataImg} src={JoinUs} alt='暂无数据' width={362} height={247} />
                    <button className={styles.seeJob}>
                        <Link href="/jobs-hiring/manila-jobs?page=1">
                            See job reco
                        </Link>
                    </button>
                </div>
      }
    </div>

}
export default MainMobile;