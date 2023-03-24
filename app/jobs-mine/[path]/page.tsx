/* eslint-disable react/no-unknown-property */
import React, { Suspense } from 'react'
import query from '../interpreters/query'
import getConfigs from 'app/interpreters/config'
import { onLoadScript } from 'app/abstractModels/filterList'
import { buildComponentScript } from 'app/abstractModels/util'
import { serverDataScript } from 'app/abstractModels/FetchServierComponents'
import SearchForm from './components/searchForms'
import styles from './index.module.scss'
import Table from './components/table'
import Loading from './components/table/loading'
import { getCurrentMonthYear, unslugify } from 'helpers/formatter'
import { decoder } from 'app/jobs-hiring/interpreters/encoder'
import { Metadata } from 'next'
import { toPairs } from 'ramda'

const configs = getConfigs([
    ['inputs', 'location_lists'],
    ['inputs', 'main_functions'],
    ['inputs', 'job_functions'],
    ['inputs', 'function_titles'],
    ['inputs', 'job_function_lists'],
    ['inputs', 'xp_lvls'],
    ['inputs', 'job_types'],
    ['inputs', 'company_sizes'],
    ['inputs', 'industry_lists'],
    ['inputs', 'company_financing_stage_lists'],
    ['filters', 'educations'],
    ['filters', 'salary_range_filters']
])

// or dynamic metadata
export async function generateMetadata(props: any) {
    /* Handle SEO Meta Tags*/
    const { month, year } = getCurrentMonthYear()
    const { params, searchParams } = props
    const { config } = await configs(serverDataScript()).run(props)
    const searchValues = decoder(config)(params.path, searchParams)
    let seoMetaTitle = `Professional Jobs in Philippines - Search & Apply Job Opportunities - ${month} ${year} | Bossjob`
    let seoMetaDescription =
        'New Jobs in Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers'
    const searchQuery = (searchValues.query ?? null) as string | null
    const location = (searchValues.location?.[0] ?? null) as string | null
    const url = new URLSearchParams(toPairs(searchParams)).toString();
    const seoCanonical = '/jobs-hiring/' +  params.path + '?' + url
    // const seoCanonical = resolvedUrl

    if (searchQuery && !location) {
        seoMetaTitle = `${unslugify(
            searchQuery,
            true
        )} Jobs in Philippines, Job Opportunities - ${month} ${year} | Bossjob`
        seoMetaDescription = `New ${unslugify(
            searchQuery,
            true
        )} Jobs in Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
    }
    else if (searchQuery && location) {
        seoMetaTitle = `${unslugify(
            searchQuery,
            true
        )} Jobs in Philippines, Apply Job Opportunities - ${month} ${year} | Bossjob`
        seoMetaDescription = `New ${unslugify(searchQuery, true)} Jobs in ${unslugify(
            location,
            true
        )}, Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
    } else {
        seoMetaTitle = `Professional Jobs in Philippines - Search & Apply Job Opportunities - ${month} ${year} | Bossjob`
        seoMetaDescription = `New Jobs in Philippines available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
    }
    const description = encodeURI(seoMetaDescription) as string
    const imageUrl = 'https://assets.bossjob.com/website/OGTagImage.png'

    const metadata: Metadata = {
        title: seoMetaTitle,
        description: description,
        // copyright: `
        //   Copyright © ${new Date().getFullYear()} Singapore: Yolo Technology Pte Ltd. All Rights Reserved.
        //   Philippines: Etos Adtech Corporation
        // `,

        openGraph: {
            title: seoMetaTitle,
            url: imageUrl,
            images: [
                {
                    url: imageUrl,
                    width: 450,
                    height: 290
                }
            ],
            description: description,
            siteName: seoMetaTitle,
            locale: 'enPH'
        },

        twitter: {
            card: 'summary_large_image',
            site: 'BossjobPH',
            title: seoMetaTitle,
            description: description,
            creator: 'BossjobPH'
        },
        viewport: {
            width: 'device-width',
            initialScale: 1.0,
            maximumScale: 1.0,
            // userScalable: 'no' as string
        },
        alternates: {
            canonical: seoCanonical
        },
        other: {
            name: seoMetaTitle,
            image: imageUrl
        }
    }
    return metadata
    
}



const Main = (props: any) => {
    return <div >
        <div style={{ position: 'sticky', top: 0, zIndex: 20 }}>
            <SearchForm config={props.config} searchValues={props.searchValues ?? null} />
        </div>
        <div className={styles.content}>
            <div className={styles.table}>
                <Suspense fallback={<Loading />}>
                    <Table searchValues={props.searchValues ?? null} config={props.config} />
                </Suspense>
            </div>
        </div>
    </div>
}

export default configs(serverDataScript())
    .chain(configs => query(onLoadScript(configs.config))
        .chain(searchValues => query(buildComponentScript({ ...configs, searchValues }, Main))))
    .run
