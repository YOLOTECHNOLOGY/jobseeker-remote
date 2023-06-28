

import React from 'react'
import PublicLayout from 'app/components/publicLayout'
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
import { getCountryKey } from 'helpers/country'
/* eslint-disable react/no-unknown-property */
import { formatTemplateString, getCurrentMonthYear } from 'helpers/formatter'
import { decoder } from '../interpreters/encoder'
import { toPairs } from 'ramda'
import getConfigs from 'app/models/interpreters/config'
import { getDictionary } from 'get-dictionary'
import { flatMap } from 'lodash-es'

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
  const { params, searchParams, params: { lang } } = props
  const { month, year } = getCurrentMonthYear(lang)

  const dictionary = await getDictionary(lang)
  const { seo: { jobSearch } } = dictionary
  const { config } = await configs(serverDataScript()).run(props)
  const searchValues = decoder(config)(params.path, searchParams)

  let seoMetaTitle = formatTemplateString(jobSearch.defaultTitle, {
    country: dictionary.seo[getCountryKey()],
    month, year
  })
  let seoMetaDescription = formatTemplateString(jobSearch.defaultDescription, {
    country: dictionary.seo[getCountryKey()]
  })
  const flatLocations = flatMap(config.location_lists, item => item.locations)
  const searchQuery = (searchValues.query ?? null) as string | null
  const location = flatLocations.find(item => item.seo_value === searchValues.location?.[0])?.value
  const url = new URLSearchParams(toPairs(searchParams)).toString()
  const seoCanonical = '/jobs-hiring/' + params.path + '?' + url
  if (searchQuery && !location) {
    seoMetaTitle = formatTemplateString(jobSearch.queryTitle, {
      searchQuery,
      country: dictionary.seo[getCountryKey()],
      month, year
    })
    seoMetaDescription = formatTemplateString(jobSearch.queryDescription, {
      searchQuery,
      country: dictionary.seo[getCountryKey()],
    })
  } else if (searchQuery && location) {
    seoMetaTitle = formatTemplateString(jobSearch.queryLocationTitle, {
      searchQuery,
      country: dictionary.seo[getCountryKey()],
      month, year, location
    })
    seoMetaDescription = formatTemplateString(jobSearch.queryLocationDescription, {
      searchQuery,
      country: dictionary.seo[getCountryKey()],
      location
    })
  }else if (!searchQuery && location) {
    seoMetaTitle = formatTemplateString(jobSearch.locationTitle, {
      searchQuery,
      country: dictionary.seo[getCountryKey()],
      month, year, location
    })
    seoMetaDescription = formatTemplateString(jobSearch.locationDescription, {
      searchQuery,
      country: dictionary.seo[getCountryKey()],
      location
    })
  } else {
    seoMetaTitle = formatTemplateString(jobSearch.defaultTitle, {
      country: dictionary.seo[getCountryKey()],
      month, year
    })
    seoMetaDescription = formatTemplateString(jobSearch.defaultDescription, {
      country: dictionary.seo[getCountryKey()]
    })
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
