import axios from 'axios'

const HuaweiJobSitemap = () => {
  return
}

export const getServerSideProps = async ({ res }) => {
  const response = await axios.get(
    process.env.ENV === 'production'
      ? 'https://assets.bossjob.com/huawei-jobs.xml'
      : 'https://dev-assets.bossjob.com/huawei-jobs.xml'
  )

  res.setHeader('Content-Type', 'text/xml')
  res.write(response.data)
  res.end()

  return {
    props: {},
  }
}

export default HuaweiJobSitemap
