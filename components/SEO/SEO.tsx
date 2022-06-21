import React from 'react'
import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  imageUrl?: string
  canonical?: string
}

const SEO = ({ title, description, imageUrl, canonical }: SEOProps) => {
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
      <meta name='twitter:creator' content='BossjobPH' />
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
