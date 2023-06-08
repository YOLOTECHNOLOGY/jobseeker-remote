// 'use client'
import './globals.scss'
import { getCountryKey } from 'helpers/country'
import './index.module.scss'
import React from 'react'

import PublicLayout from './components/publicLayout'
import { getDictionary } from 'get-dictionary'
import { formatTemplateString } from 'helpers/formatter'



export default async function RootLayout(props: any) {

  const { children, params: { lang } } = props
  const dictionary = await getDictionary(lang)
  const defaultSEO = {
    title: formatTemplateString(dictionary.seo.siteName, dictionary.seo[getCountryKey()]),
    description: formatTemplateString(dictionary.seo.siteName, dictionary.seo[getCountryKey()]),
    imageUrl: 'https://assets.bossjob.com/website/OGTagImage.png',
    canonical: ''
  }

  return (
    /* @ts-expect-error Async Server Component */
    <PublicLayout {...props} seo={defaultSEO} >
      {children}
    </PublicLayout>
  )
}
