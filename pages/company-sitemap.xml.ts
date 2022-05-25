import axios from 'axios'

const CompanySitemap = () => {
  return
}

export const getServerSideProps = async ({ res }) => {
  const response = await axios.get(
    process.env.CUSTOM_NODE_ENV === 'production'
      ? 'https://assets.bossjob.com/company-sitemap.xml'
      : 'https://dev-assets.bossjob.com/company-sitemap.xml'
  )

  res.setHeader('Content-Type', 'text/xml')
  res.write(response.data)
  res.end()

  return {
    props: {},
  }
}

export default CompanySitemap
