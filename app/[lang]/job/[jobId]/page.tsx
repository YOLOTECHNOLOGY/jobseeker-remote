import { cookies } from 'next/headers'
import type { Metadata } from 'next'

import Index from './index'
import { getGoogleJobJSON } from 'app/[lang]/components/SEO'

import { fetchJobDetailService } from 'store/services/jobs/fetchJobDetail'
import { getShreCard } from 'store/services/jobs/addJobView'

const handleFetchJobDetail = async (params: any) => {
  const cookieStore = cookies()

  const accessToken = cookieStore.getAll('accessToken')
  const jobId = params.jobId?.split('-').pop()

  const querys = {
    jobId,
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
}


const handleShareInfo = async (params: any) => {
  const shareId = params.jobId?.split('-').shift();
  const res = await getShreCard(shareId)
  return  res.data.data 
}

export async function generateMetadata({ params,searchParams}): Promise<Metadata> {
  const { data: jobDetail } = await handleFetchJobDetail(params)
  let shareInfo = null
  if(searchParams?.share){
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

   const {
    wide:width,
    high:height,
    job_card:cardUrl,
  } = shareInfo || {}
  console.log(shareInfo,'shareInfo')
    const categoryMetaText = 'jobs'
    const seoMetaTitle = `${name} is hiring ${jobTitle} - ${jobId} | Bossjob`
    const seoMetaDescription = `Apply for ${jobTitle} (${jobId}) at ${name}. Discover more ${categoryMetaText} in ${
      location.value
    }, ${fullAddress.split(',').pop()} on Bossjob now!`

    console.log(jobDetail, seoMetaDescription)

    const seoParams: Metadata = !shareInfo ? {
      title: seoMetaTitle,
      description: seoMetaDescription,
      openGraph: {
        images: [
          {
            url: jobDetail?.company?.logo,
            width: 450,
            height: 290
          }
        ]
      },
      alternates: {
        canonical: (process.env.NEXT_PUBLIC_HOST_PATH ?? '') + jobUrl
      }
    } : {
      title: seoMetaTitle,
      description: seoMetaDescription,
      openGraph: {
        images: [
          {
            url: cardUrl,
            width: width,
            height: height
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: seoMetaTitle,
        description: seoMetaDescription,
        images: [ cardUrl],
      },

    }
   console.log(seoParams,'seoParams')
    return seoParams
  }
}

const Page = async ({ params }: any) => {
  const { data, jobId } = await handleFetchJobDetail(params)
  const jobDetail = data

  return (
    <>
      <Index data={data} jobId={jobId} />

      {jobDetail && jobDetail?.status_key === 'active' && (
        <script
          defer
          async
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: `${getGoogleJobJSON(jobDetail)}`
          }}
        ></script>
      )}
    </>
  )
}

export default Page
