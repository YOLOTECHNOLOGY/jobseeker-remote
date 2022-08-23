import configuredAxios from 'helpers/configuredAxios'
import { getPublicSitemapXML } from '../scripts/getPublicSitemapXML'

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

// export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ res }) => {
//   store.dispatch(fetchConfigRequest())
//   store.dispatch(oldFetchConfigRequest())
//   store.dispatch(END)
//   await (store as any).sagaTask.toPromise()
//   const storeState = store.getState()
//   const oldConfig = storeState.config.oldConfig.response
//   const newConfig = storeState.config.config.response

//   const publicSiteMap = getPublicSitemapXML(oldConfig, newConfig)

//   res.setHeader('Content-Type', 'text/xml')
//   res.write(publicSiteMap)
//   res.end()

//   return {
//     props: {},
//   }
// })

export default Sitemap
