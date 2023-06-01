import React from 'react'
import getConfigs from 'app/[lang]/interpreters/config'
import { buildComponentScript } from 'app/[lang]/abstractModels/util'
import { serverDataScript } from 'app/[lang]/abstractModels/FetchServierComponents'

import PhoneLogin from './PhoneLogin'

import { getDictionary } from 'get-dictionary'
const configs = getConfigs([
  ['location_lists'],
])

const PhoneIndex = async (props: any) => {
  const { lang } = props.params
  const dictionary: any = await getDictionary(lang)

  return (
    <>
      <PhoneLogin lang={dictionary} />
    </>
  )
}

export default configs(serverDataScript().chain(props => buildComponentScript(props, PhoneIndex))).run