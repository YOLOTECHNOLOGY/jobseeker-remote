import Layout from 'components/Layout'
// import SEO from 'components/SEO'
interface PropsType {
  children: React.ReactNode
}

const QuickLayout = ({ children }: PropsType) => {
  return (
    <Layout isHiddenFooter>
      {/* <SEO
        title='Sign Up | Bossjob'
        description='Join Bossjob to accelerate your professional career today! Access courses and job opportunities in Philippines. Network of 2 million+ professionals.'
        canonical='/register/jobseeker'
      /> */}
      {children}
    </Layout>
  )
}

export default QuickLayout
