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
import UploadResumeButton from './components/UploadResumeButton'
import { cookies } from 'next/headers'
import searchHistoryIp from '../interpreters/searchHistory'
import SearchHistories from './components/searchHistories'
import Image from 'next/image'
import { AppDownQRCode } from 'images'
import JobAlert from './components/jobAlert'
import { getCurrentMonthYear, unslugify } from 'helpers/formatter'
import { decoder } from '../interpreters/encoder'
import { Metadata } from 'next'
import { toPairs } from 'ramda'
import LoadingProvider from 'app/components/providers/loadingProvider'
import Footer from 'components/Footer'
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
  const url = new URLSearchParams(toPairs(searchParams)).toString()
  const seoCanonical = '/jobs-hiring/' + params.path + '?' + url
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
  } else if (searchQuery && location) {
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
  const description = seoMetaDescription
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
      maximumScale: 1.0
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
  // return {
  //     seoMetaTitle,
  //     seoMetaDescription: encodeURI(seoMetaDescription),
  //     seoCanonical,
  //     canonicalUrl: seoCanonical
  // }
}

const SearchHistory = searchHistoryIp(
  serverDataScript().chain((list) => buildComponentScript({ list }, SearchHistories))
).run

const Main = (props: any) => {
  const accessToken = cookies().get('accessToken')?.value
  const location = props.searchValues?.location?.[0]
  return (
    <LoadingProvider>
      <div>
        <div style={{ position: 'sticky', top: 0, zIndex: 90 }}>
          <SearchForm config={props.config} searchValues={props.searchValues ?? null} />
        </div>
        <div className={styles.content}>
          <div className={styles.table}>
            {/* <Loading/> */}
            <JobAlert searchValues={props.searchValues} config={props.config} />
            <Suspense fallback={<Loading />}>
              <Table searchValues={props.searchValues ?? null} config={props.config} />
            </Suspense>
          </div>
          <div className={styles.rightContent}>
            <UploadResumeButton
              isShowBtn={!accessToken}
              isShowArrowIcon={false}
              className={styles.arrowIconPostion}
            />
            <div className={styles.qrCode}>
              <Image src={AppDownQRCode} alt='app down' width='85' height='88' />
              <div className={styles.rightContainer}>
                <label>Chat directly with Boss</label>
                <p>
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                    transform='translate(-2,3)'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M11 2.5H13.5V5'
                      stroke='white'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M5 13.5H2.5V11'
                      stroke='white'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M13.5 11V13.5H11'
                      stroke='white'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M2.5 5V2.5H5'
                      stroke='white'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M10.5 5H5.5C5.22386 5 5 5.22386 5 5.5V10.5C5 10.7761 5.22386 11 5.5 11H10.5C10.7761 11 11 10.7761 11 10.5V5.5C11 5.22386 10.7761 5 10.5 5Z'
                      stroke='white'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  Scan QR code to download APP
                </p>
              </div>
            </div>
            <SearchHistory
              location={location}
              value={props?.searchValues?.query as any}
              path={props.params?.path}
            />
          </div>
        </div>
      </div>
      <Footer />
    </LoadingProvider>
  )
}

export default configs(serverDataScript()).chain((configs) =>
  query(onLoadScript(configs.config)).chain((searchValues) =>
    query(buildComponentScript({ ...configs, searchValues }, Main))
  )
).run
