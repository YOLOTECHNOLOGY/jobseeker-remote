/* eslint-disable react/display-name */
import React from 'react'
import Layout from './[lang]/layout'
import { getCountryAndLang } from '../middleware'
import { cookies } from 'next/headers'

export default (props: any) => {
    const locale = getCountryAndLang(cookies() as any || 'en-US')
    const lang = locale?.[1]
    const withLangProps = { ...props, params: { lang } }
    {/* @ts-expect-error Async Server Component */ }
    return <Layout {...withLangProps} />
}