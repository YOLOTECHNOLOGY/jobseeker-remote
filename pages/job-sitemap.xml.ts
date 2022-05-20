import axios from 'axios'

const JobSitemap = () => {
  return
}

export const getServerSideProps = async ({ res }) => {
  const response = await axios.get(
    process.env.CUSTOM_NODE_ENV === 'production'
      ? 'https://assets.bossjob.com/job-sitemap.xml'
      : 'https://dev-assets.bossjob.com/job-sitemap.xml'
  )

  res.setHeader('Content-Type', 'text/xml')
  res.write(response.data)
  res.end()

  return {
    props: {},
  }
}

export default JobSitemap
