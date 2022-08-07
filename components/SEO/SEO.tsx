import React from 'react'
import Head from 'next/head'
import moment from 'moment'

 const getEmploymentType = type => {
  switch (type) {
  case 'Internship':
    return 'INTERN'
  case 'Contract':
    return 'CONTRACTOR'
  case 'Temporary':
    return 'TEMPORARY'
  case 'Full-time':
    return 'FULL_TIME'
  case 'Part-time':
    return 'PART_TIME'
  default:
    return 'OTHER'
  }
}

const getGoogleJobJSON = jobDetail => {
  // Hardcoded active jobs to be expired in 2 years
  const postedDate = new Date(jobDetail.published_at)

  const expiredDate =
    jobDetail.status_key === 'active'
      ? moment(postedDate.setFullYear(postedDate.getFullYear() + 2)).format('YYYY-MM-DD')
      : moment(new Date(jobDetail.expired_at)).format('YYYY-MM-DD')

  let jobJSON: any = {
    '@context': 'http://schema.org/',
    '@type': 'JobPosting',
    title: jobDetail.job_title,
    description:
      jobDetail.job_description_html && jobDetail.job_description_html !== ''
        ? jobDetail.job_description_html + jobDetail.job_requirements_html
        : jobDetail.job_description + jobDetail.job_requirements,
    employmentType: getEmploymentType(jobDetail.job_type_value),
    datePosted: moment(new Date(jobDetail.published_at)).format('YYYY-MM-DD'),
    validThrough: expiredDate,
    hiringOrganization: {
      '@type': 'Organization',
      name: jobDetail.company.name,
      sameAs: jobDetail.company.website,
      logo: jobDetail.company.logo
    },
    identifier: {
      '@type': 'PropertyValue',
      name: jobDetail.company.name,
      value: jobDetail.company.id
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress:
          jobDetail.full_address && jobDetail.full_address !== ''
            ? jobDetail.full_address
            : jobDetail.location.value,
        addressLocality: jobDetail.location.value,
        addressRegion: jobDetail.location.region,
        postalCode: '1000', // TODO: Hardcoded to manila postal/zip code first, need to refactor it later when we start to ask for zip code from recruiters
        addressCountry: jobDetail?.job_country
      }
    }
  }

  if (
    !isNaN(jobDetail.salary_range_from) &&
    !isNaN(jobDetail.salary_range_to)
  ) {
    jobJSON = {
      ...jobJSON,
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'PHP',
        value: {
          '@type': 'QuantitativeValue',
          minValue: jobDetail.salary_range_from,
          maxValue: jobDetail.salary_range_to,
          unitText: 'MONTH'
        }
      }
    }
  }

  return JSON.stringify(jobJSON)
}

interface SEOProps {
  title: string
  description: string
  imageUrl?: string
  canonical?: string
  jobDetail?: any
}

const SEO = ({ title, description, imageUrl, canonical, jobDetail=null }: SEOProps) => {
  const canonicalPath = process.env.HOST_PATH + canonical

  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={decodeURI(description)} />
      <meta
        name='copyright'
        content={`
          Copyright © ${new Date().getFullYear()} Singapore: Yolo Technology Pte Ltd. All Rights Reserved.
          Philippines: Etos Adtech Corporation
        `}
      />
      <meta name='author' content='Academy' />

      {/* Open Graph */}
      <meta property='og:title' content={title} />
      <meta property='og:image' content={imageUrl} />
      <meta property='og:image:secure_url' content={imageUrl} />
      <meta property='og:image:width' content='450' />
      <meta property='og:image:height' content='298' />
      <meta property='og:type' content='website' />
      <meta property='og:description' content={decodeURI(description)} />
      <meta property='og:locale' content='en_PH' />
      <meta
        property='og:site_name'
        content='Bossjob - Career Platform for Professionals in Philippines'
      />

      {/* Schema.org markup for Google+ */}
      <meta itemProp='name' content={title} />
      <meta itemProp='image' content={imageUrl} />
      <link rel='canonical' href={canonicalPath} />

      {/* Twitter Card */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='BossjobPH' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={decodeURI(description)} />
      <meta name='twitter:image' content={imageUrl} />
      <meta name='twitter:image:alt' content={decodeURI(description)} />
      <meta name='twitter:creator' content='BossjobPH' />

      {jobDetail && jobDetail?.status_key === 'active' && (
        <script
          defer
          async
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `${getGoogleJobJSON(jobDetail)}`,
          }}
        ></script>
      )}
    </Head>
  )
}

SEO.defaultProps = {
  title: 'Bossjob - Career Platform for Professionals in Philippines',
  description: 'Bossjob - Career Platform for Professionals in Philippines',
  imageUrl: 'https://assets.bossjob.com/website/OGTagImage.png',
  canonical: '',
}

export default SEO
