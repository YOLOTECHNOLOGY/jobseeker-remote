import React from 'react'
import EmailLogin from './EmailLogin'
import { getDictionary } from 'get-dictionary'

const EmailIndex = async (props: any) => {
  const { lang } = props.params
  const dictionary: any = await getDictionary(lang)

  return (
    <>
      <EmailLogin lang={dictionary} />
    </>
  )
}

export default EmailIndex