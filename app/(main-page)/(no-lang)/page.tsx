/* eslint-disable import/no-anonymous-default-export */
import { getCountryAndLang } from 'middleware'
import styles from 'app/index.module.scss'
import { cookies } from 'next/headers'
import React from 'react'
import { getDictionary } from 'get-dictionary'
import Main from '../components/main'

export default async (props: any) => {
    const locale = getCountryAndLang(cookies() as any || 'en-US')
    const lang = locale?.[1] as any
    const dictionary = await getDictionary(lang)
    const newProps = { ...props, lang: dictionary }
    return <div className={styles.container}>
        {/* @ts-expect-error Async Server Component */}
        <Main {...newProps} />
    </div>
}