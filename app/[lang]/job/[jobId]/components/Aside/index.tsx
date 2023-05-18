import { cookies } from 'next/headers'

import AdSlot from 'app/[lang]/components/AdSlot'
import Company, { propsType } from './Company/Company'
import SignUp from './SignUp/SignUp'
import SimilarJobs from './SimilarJobs/SimilarJobs'
import Search from '../Main/Search/Search'
import Btn from '../Head/Btn/Btn'

import styles from '../../page.module.scss'

type propsT = propsType & { jobDetail: any } & {
  published_at: string
  languages: Record<string, any>
  config:Array<any>
} 

const AsideFC = (props: propsT) => {
  const cookieStore = cookies()
  const token = cookieStore.get('accessToken')
  const { content } = props.languages
  const { id, is_saved, chat } = props.jobDetail
  return (
    <aside className={styles.aside}>
      {!token && <SignUp jobId={props.jobId} job_url={props.jobDetail?.job_url} />}

      <Company {...props} />

      {/* @ts-expect-error Async Server Component */}
      <SimilarJobs id={props.jobId} jobDetail={props.jobDetail} languages={props.languages} config={props.config}/>

      <div className={styles.ad_container}>
        <AdSlot adSlot={'job-detail/square-banner-1'} />
      </div>

      <Search />

      <span className={styles.published_at}>
        {content.jobPostedOn} {props.published_at}
      </span>

      <div className={styles.aside_mobilesticky_btnGroup}>
        <Btn
          jobId={id}
          is_saved={is_saved}
          chat={chat}
          className={styles.aside_mobilesticky_btnGroup_change}
          jobDetail={props.jobDetail}
        />
      </div>
    </aside>
  )
}

export default AsideFC
