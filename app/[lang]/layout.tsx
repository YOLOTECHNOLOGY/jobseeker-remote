// 'use client'
import './globals.scss'
import { getCountry } from 'helpers/country'
import './index.module.scss'
import React from 'react'
import PublicLayout from './components/publicLayout'
const defaultSEO = {
  title: `Bossjob - Career Platform for Professionals in ${getCountry()}`,
  description: `Bossjob - Career Platform for Professionals in ${getCountry()}`,
  imageUrl: 'https://assets.bossjob.com/website/OGTagImage.png',
  canonical: ''
}

export default async function RootLayout(props: any) {
  return (
    /* @ts-expect-error Async Server Component */
    <PublicLayout {...props} seo={defaultSEO} />
  )
}
