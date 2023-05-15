import ResumeTemplate from './ResumeTemplate'

export async function getServerSideProps({ req }) {
    const accessToken = req.cookies.accessToken
    if (accessToken) {
      return {
        redirect: {
          destination: `${process.env.OLD_PROJECT_URL}/dashboard/profile/jobseeker`,
          permanent: false
        }
      }
    }
    return {
      props: {
        seoMetaTitle: 'Free Resume Template to Edit & Download | Bossjob.ph',
        seoMetaDescription: 'Free resume template & sample for you to edit and download on Bossjob. Customize your resume and add career objectives, work experiences and job skills!',
        canonicalUrl: '/resumetemplate'
      }
    }
  }

export default ResumeTemplate