import Layout from 'components/Layout'
// import SEO from 'components/SEO'
interface PropsType {
  children: React.ReactNode
  lang: Record<string, any>
}

const QuickLayout = ({ children, lang }: PropsType) => {
  return (
    <Layout isHiddenFooter lang={lang}>
      {children}
    </Layout>
  )
}

export default QuickLayout
