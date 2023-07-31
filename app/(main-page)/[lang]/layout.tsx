// 'use client'
import 'app/globals.scss'
import { getCountryKey } from 'helpers/country'
import 'app/index.module.scss'
import React from 'react'

import PublicLayout from 'app/components/publicLayout'
import { getDictionary } from 'get-dictionary'
import { formatTemplateString } from 'helpers/formatter'

// export const revalidate = 3600
// export async function generateStaticParams(params: any) {
//   console.log({ generateStaticParams: params })
//   return [
//     { lang: 'en-US' },
//     { lang: 'zh-CN' },
//     { lang: 'ja-JP' },
//     { lang: 'id-ID' },
//   ]
// }

export default async function RootLayout(props: any) {

  const { children, params: { lang } } = props
  const dictionary = await getDictionary(lang)
  const defaultSEO = {
    title: formatTemplateString(dictionary.seo.siteName, dictionary.seo[getCountryKey()]),
    description: formatTemplateString(dictionary.seo.metaDescription, dictionary.seo[getCountryKey()]),
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
