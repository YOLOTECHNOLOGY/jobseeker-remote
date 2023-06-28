import Footer from 'components/Footer'
import './page.module.scss'
import 'components/Header/Header.module.scss'
import 'app/globals.scss'
import { getShreCard } from 'store/services/jobs/addJobView'
import PublicLayout from 'app/components/publicLayout'
import { handleFetchJobDetail } from './service'
import { getDictionary } from 'get-dictionary'
import { formatTemplateString } from 'helpers/formatter'
export const revalidate = 3600
const handleShareInfo = async (params: any): Promise<any> => {
  const shareId = params.jobId?.split('-').shift()
  const res = await getShreCard(shareId)
  return res.data.data
}

async function generateSEO({ params, searchParams }) {
  const { data: jobDetail } = await handleFetchJobDetail(params)
  const { lang } = params
  const dictionary = await getDictionary(lang)
  const { seo: { job } } = dictionary
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
    const seoMetaTitle = formatTemplateString(job.title, {
      name,
      jobTitle,
      jobId
    })
    const seoMetaDescription = formatTemplateString(job.description, {
      jobTitle, jobId, name,
      location: location.value,
      address: fullAddress.split(',').pop()
     
    })
    // `Apply for ${jobTitle} (${jobId}) at ${name}. Discover more 'jobs' in ${location.value
    //   }, ${fullAddress.split(',').pop()} on Bossjob now!`
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
