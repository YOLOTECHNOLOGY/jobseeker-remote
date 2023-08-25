import Resume from './Resume'
import InterestedMe from './InterestedMe'
import ViewedMe from './ViewedMe'
import { fetchResumes } from 'store/services/jobs/fetchJobsCommunicated'
import { cookies } from 'next/headers'
import styles from '../index.module.scss'
import ExcellentResumeBanner from './excellentResume'
// import VipActivity from './vipActivity'

async function getResumes(accessToken) {
  const res = await fetchResumes({ accessToken })
  return res?.data?.data || {}
}

export default async function Page(props) {
  const accessToken = cookies().get('accessToken')?.value
  const resumesData = await getResumes(accessToken)
  const [resumes] = await Promise.all([resumesData])
  return (
    <div className={styles.aside}>
      <Resume resumes={resumes} {...props} />
      {/* @ts-expect-error Async Server Component */}
      <InterestedMe {...props} />
      {/* @ts-expect-error Async Server Component */}
      <ViewedMe {...props} />
      {/* <VipActivity /> */}
      <ExcellentResumeBanner />
    </div>
  )
}
