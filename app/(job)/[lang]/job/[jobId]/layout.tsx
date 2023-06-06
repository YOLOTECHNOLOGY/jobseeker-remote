import Footer from 'components/Footer'
import './page.module.scss'
import 'components/Header/Header.module.scss'
import 'app/[lang]/globals.scss'
import { getShreCard } from 'store/services/jobs/addJobView'
import { cookies } from 'next/headers'
import { fetchJobDetailService } from 'store/services/jobs/fetchJobDetail'
import PublicLayout from 'app/[lang]/components/publicLayout'
const handleFetchJobDetail = async (params: any) => {
  const cookieStore = cookies()

  const accessToken = cookieStore.getAll('accessToken')
  const jobId = params.jobId?.split('-').pop()

  if (jobId && Number(jobId)) {
    const querys = {
      jobId: jobId,
      status: 'public',
      serverAccessToken: null
    }

    if (accessToken[0]) {
      querys.status = accessToken[0].value ? 'protected' : 'public'
      querys.serverAccessToken = accessToken[0].value ?? null
    }

    const data = await fetchJobDetailService(querys)
      .then(({ data: { data } }) => data)
      .catch(() => ({ error: true }))
    return { data, jobId }
  } else {
    return { data: { error: true, message: 'Error: Invalid link address' }, jobId: null }
  }
}

const handleShareInfo = async (params: any): Promise<any> => {
  const shareId = params.jobId?.split('-').shift()
  const res = await getShreCard(shareId)
  return res.data.data
}

async function generateSEO({ params, searchParams }) {
  const { data: jobDetail } = await handleFetchJobDetail(params)
  let shareInfo = null
  if (searchParams?.share) {
    shareInfo = await handleShareInfo(params)
  }

  if (Object.keys(jobDetail).length > 0 && jobDetail?.id) {
    const {
      id: jobId,
      job_title: jobTitle,
      company: { name },
      // categories,
      full_address: fullAddress,
      location,
      job_url: jobUrl
    } = jobDetail

    const { job_card: cardUrl } = shareInfo || {}
    const categoryMetaText = 'jobs'
    const seoMetaTitle = `${name} is hiring ${jobTitle} - ${jobId} | Bossjob`
    const seoMetaDescription = `Apply for ${jobTitle} (${jobId}) at ${name}. Discover more ${categoryMetaText} in ${location.value
      }, ${fullAddress.split(',').pop()} on Bossjob now!`
    const seoParams = !shareInfo
      ? {
        title: seoMetaTitle,
        description: seoMetaDescription,
        imageUrl: jobDetail?.company?.logo,
        canonical: (process.env.NEXT_PUBLIC_HOST_PATH ?? '') + jobUrl

      }
      : {
        title: seoMetaTitle,
        description: seoMetaDescription,
        imageUrl: cardUrl,
        canonical: (process.env.NEXT_PUBLIC_HOST_PATH ?? '') + jobUrl

      }
    return seoParams
  }
  return {}
}
export default async function Layout(props: any) {
  const { children } = props
  const seo = await generateSEO(props)
  return (
    /* @ts-expect-error Async Server Component */
    <PublicLayout {...props} seo={seo} >
      {children}
      <Footer />
    </PublicLayout>
  )
}
