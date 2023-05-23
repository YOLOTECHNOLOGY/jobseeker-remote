import { getCountryAndLang } from '../middleware'
import Page from './[lang]/page'
import Layout from './[lang]/layout'
import { cookies } from 'next/headers'
import React from 'react'
const MainPage = props => {
    const locale = getCountryAndLang(cookies() as any || 'en-US')
    const lang = locale?.[1]
    const withLangProps = { ...props, params: { lang } }
    {/* @ts-expect-error Async Server Component */ }
    return <Layout {...withLangProps}>
        {/* @ts-expect-error Async Server Component */}
        <Page {...withLangProps} />
    </Layout>
}
export default MainPage