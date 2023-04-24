import configuredAxios from 'helpers/configuredAxios'
import { getPublicSitemapXML } from '../../scripts/getPublicSitemapXML'

const Sitemap = () => {
  return
}

export const getServerSideProps = async ({ res }) => {
  const axios = configuredAxios('config', 'public')
  const response = await axios.get('/list')
  const publicSiteMap = getPublicSitemapXML(response)

  res.setHeader('Content-Type', 'text/xml')
  res.write(publicSiteMap)
  res.end()

  return {
    props: {},
  }
}

export default Sitemap
