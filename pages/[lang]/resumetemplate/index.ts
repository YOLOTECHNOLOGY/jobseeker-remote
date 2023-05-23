import { getDictionary } from 'get-dictionary'
import ResumeTemplate from './ResumeTemplate'

export async function getServerSideProps({ req, query }) {
  const accessToken = req.cookies.accessToken
  if (accessToken) {
    return {
      redirect: {
        destination: `${process.env.OLD_PROJECT_URL}/dashboard/profile/jobseeker`,
        permanent: false
      }
    }
  }
  const lang = await getDictionary(query.lang)
  return {
    props: {
      lang,
      seoMetaTitle: 'Free Resume Template to Edit & Download | Bossjob.ph',
      seoMetaDescription: 'Free resume template & sample for you to edit and download on Bossjob. Customize your resume and add career objectives, work experiences and job skills!',
      canonicalUrl: '/resumetemplate'
    }
  }
}

export default ResumeTemplate