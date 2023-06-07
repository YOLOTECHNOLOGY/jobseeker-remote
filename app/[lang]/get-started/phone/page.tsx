import React from 'react'

import PhoneLogin from './PhoneLogin'
import { getDictionary } from 'get-dictionary'

const PhoneIndex = async (props: any) => {
  const { lang } = props.params
  const dictionary: any = await getDictionary(lang)

  return (
    <>
      <PhoneLogin lang={dictionary} />
    </>
  )
}

export default PhoneIndex