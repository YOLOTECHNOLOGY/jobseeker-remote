/* eslint-disable import/no-anonymous-default-export */
import AccountSettings from './main'
import Footer from 'components/Footer'

import { buildComponentScript, needLogin } from 'app/models/abstractModels/util'
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
import interpreter from './interpreter'
import getConfigs from 'app/models/interpreters/config'
import { getDictionary } from 'get-dictionary'

const configs = getConfigs([['country_lists']])
const Settings = async (props: any) => {
  const lang = await getDictionary(props?.params?.lang as 'en-US')
  return (
    <>
      <AccountSettings {...props} lang={lang} />
      <Footer />
    </>
  )
}

export default props => {
  const { searchParams } = props
  let searchString = Object.keys(searchParams).map(key => {
    return `${key}=${searchParams[key]}`
  }).join('&')
  if (searchString) {
    searchString = `?${searchString}`
  }

  return configs(serverDataScript()).chain((configs) =>
    interpreter(
      needLogin(
        serverDataScript().chain((userDetail) =>
          buildComponentScript({ userDetail, config: configs.config }, Settings)
        ),
        '/settings' + searchString
      )
    )
  ).run(props)
}
