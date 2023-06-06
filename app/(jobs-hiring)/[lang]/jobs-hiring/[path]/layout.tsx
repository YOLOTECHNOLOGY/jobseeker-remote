

import React from 'react'
import PublicLayout from 'app/[lang]/components/publicLayout'
import { serverDataScript } from 'app/[lang]/abstractModels/FetchServierComponents'
import { getCountry } from 'helpers/country'
/* eslint-disable react/no-unknown-property */
import { getCurrentMonthYear, unslugify } from 'helpers/formatter'
import { decoder } from '../interpreters/encoder'
import { toPairs } from 'ramda'
import getConfigs from 'app/[lang]/interpreters/config'

const configs = getConfigs([
  ['location_lists'],
  ['main_functions'],
  ['job_functions'],
  ['function_titles'],
  ['job_function_lists'],
  ['xp_lvls'],
  ['job_types'],
  ['company_sizes'],
  ['industry_lists'],
  ['company_financing_stage_lists'],
  ['educations'],
  ['salary_range_filters'],
  ['job_benefit_lists'],
  ['main_job_function_lists'],
  ['degrees'],
  ['salary_ranges'],
  ['subscibe_job_frequency_lists'],
  ['country_lists'],
])
async function generateSEO(props: any) {
  /* Handle SEO Meta Tags*/
  const { month, year } = getCurrentMonthYear()
  const { params, searchParams } = props
  const { config } = await configs(serverDataScript()).run(props)
  const searchValues = decoder(config)(params.path, searchParams)
  let seoMetaTitle = `Professional Jobs in ${getCountry()} - Search & Apply Job Opportunities - ${month} ${year} | Bossjob`
  let seoMetaDescription = `New Jobs in ${getCountry()}available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
  const searchQuery = (searchValues.query ?? null) as string | null
  const location = (searchValues.location?.[0] ?? null) as string | null
  const url = new URLSearchParams(toPairs(searchParams)).toString()
  const seoCanonical = '/jobs-hiring/' + params.path + '?' + url
  if (searchQuery && !location) {
    seoMetaTitle = `${unslugify(
      searchQuery,
      true
    )} Jobs in ${getCountry()}, Job Opportunities - ${month} ${year} | Bossjob`
    seoMetaDescription = `New ${unslugify(
      searchQuery,
      true
    )} Jobs in ${getCountry()} available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
  } else if (searchQuery && location) {
    seoMetaTitle = `${unslugify(
      searchQuery,
      true
    )} Jobs in ${getCountry()}, Apply Job Opportunities - ${month} ${year} | Bossjob`
    seoMetaDescription = `New ${unslugify(searchQuery, true)} Jobs in ${unslugify(
      location,
      true
    )}, ${getCountry()} available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
  } else {
    seoMetaTitle = `Professional Jobs in ${getCountry()} - Search & Apply Job Opportunities - ${month} ${year} | Bossjob`
    seoMetaDescription = `New Jobs in ${getCountry()} available on Bossjob. Advance your professional career on Bossjob today - Connecting pre-screened experienced professionals to employers`
  }
  const description = seoMetaDescription
  const imageUrl = 'https://assets.bossjob.com/website/OGTagImage.png'
  const seo = {
    title: seoMetaTitle,
    description: description,
    url: imageUrl,
    canonical: seoCanonical
  }
  return seo
}

export default async function RootLayout(props: any) {
  const { children } = props
  const seo = await generateSEO(props)

  return (
    /* @ts-expect-error Async Server Component */
    <PublicLayout {...props} seo={seo} >
      {children}
    </PublicLayout>
  )
}
