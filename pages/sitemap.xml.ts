import configuredAxios from '../helpers/configuredAxios'
import { getPublicSitemapXML } from '../scripts/getPublicSitemapXML'

const Sitemap = () => {
  return
}

export const getServerSideProps = async ({ res }) => {
  const axios = configuredAxios('data', 'public')
  const response = await axios.get('/config?country_code=ph')
  const publicSiteMap = getPublicSitemapXML(response)

  res.setHeader('Content-Type', 'text/xml')
  res.write(publicSiteMap)
  res.end()

  return {
    props: {},
  }
}

export default Sitemap
