import Layout from 'components/Layout'
import QuickUploadResume from './quick-upload-resume'
import SEO from 'components/SEO'

const LayoutQuickUploadResume = () => {
  return (
    <Layout>
      <SEO
        title='Sign Up | Bossjob'
        description='Join Bossjob to accelerate your professional career today! Access courses and job opportunities in Philippines. Network of 2 million+ professionals.'
        canonical='/register/jobseeker'
      />
      <QuickUploadResume></QuickUploadResume>
    </Layout>
  )
}

export default LayoutQuickUploadResume
