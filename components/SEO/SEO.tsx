import React from 'react'
import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  imageUrl?: string
  canonical?: string
}

const SEO = ({ title, description, imageUrl, canonical }: SEOProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={unescape(description)} />
      <meta
        name='copyright'
        content={`
          Copyright © ${new Date().getFullYear()} Singapore: Yolo Technology Pte Ltd. All Rights Reserved.
          Philippines: Etos Adtech Corporation
        `}
      />
      <meta name='author' content='Academy' />

      {/* <meta itemProp="name" content={seoTitle} /> */}
      <meta itemProp='image' content={imageUrl} />
      <link rel='canonical' href={canonical} />
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
