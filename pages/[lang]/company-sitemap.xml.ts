import axios from 'axios'
import { getCountryKey } from 'helpers/country'

const CompanySitemap = () => {
  return
}

export const getServerSideProps = async ({ res }) => {
  const country = getCountryKey()
  const response = await axios.get(
    process.env.ENV === 'production'
      ? `https://assets.bossjob.com/company-sitemap-${country}.xml`
      : `https://dev-assets.bossjob.com/company-sitemap-${country}.xml`
  )

  res.setHeader('Content-Type', 'text/xml')
  res.write(response.data)
  res.end()

  return {
    props: {}
  }
}

export default CompanySitemap
