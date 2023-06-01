import React from 'react'
import getConfigs from 'app/[lang]/interpreters/config'
import { buildComponentScript } from 'app/[lang]/abstractModels/util'
import { serverDataScript } from 'app/[lang]/abstractModels/FetchServierComponents'

import EmailLogin from './EmailLogin'

import { getDictionary } from 'get-dictionary'
const configs = getConfigs([
  ['location_lists'],
])

const EmailIndex = async (props: any) => {
  const { lang } = props.params
  const dictionary: any = await getDictionary(lang)

  return (
    <>
      <EmailLogin lang={dictionary} />
    </>
  )
}

export default configs(serverDataScript().chain(props => buildComponentScript(props, EmailIndex))).run