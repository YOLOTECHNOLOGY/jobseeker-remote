import Layout from 'components/Layout'
// import SEO from 'components/SEO'
interface PropsType {
  children: React.ReactNode
}

const QuickLayout = ({ children }: PropsType) => {
  return (
    <Layout isHiddenFooter>
      
      {children}
    </Layout>
  )
}

export default QuickLayout
