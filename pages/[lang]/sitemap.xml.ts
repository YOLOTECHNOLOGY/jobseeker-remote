import configuredAxios from 'helpers/configuredAxios'
import { getPublicSitemapXML } from '../../scripts/getPublicSitemapXML'
import { getCountryKey, getLang } from 'helpers/country'

const Sitemap = () => {
  return
}

export const getServerSideProps = async ({ res }) => {
  const country = getCountryKey()
  const lang = getLang()
  const axios = configuredAxios('config', 'public')
  const response = await axios.get(`/${country}/list?language_code?${lang}`)
  const publicSiteMap = getPublicSitemapXML(response)

  res.setHeader('Content-Type', 'text/xml')
  res.write(publicSiteMap)
  res.end()

  return {
    props: {}
  }
}

export default Sitemap
