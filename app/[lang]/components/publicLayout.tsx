// 'use client'
// import Providers from './components/providers'
import Header from 'components/Header'
import dynamic from 'next/dynamic'
import HamburgerMenu from 'components/HamburgerMenu'
import AutoShowModalAppRedirect from 'app/[lang]/main-page/components/AutoShowModalAppRedirect'
import { getCountry } from 'helpers/country'
import { getDictionary } from 'get-dictionary'
import React from 'react'
import 'app/[lang]/globals.scss'
import 'app/[lang]/index.module.scss'
const Providers = dynamic(() => import('app/[lang]/components/providers'), { ssr: true })
const Initial = dynamic(() => import('app/[lang]/components/Initals'), { ssr: false })
export default async function PublicLayout(props: any) {
  const gtmID = process.env.ENV === 'production' ? 'GTM-KSGSQDR' : 'GTM-PR4Z29C'
  const { children, seo }: any = props
  const { title, imageUrl, description, canonical } = seo
  const { lang } = props.params
  const dictionary = await getDictionary(lang)
  return (
    <html lang={lang}>
      <head key={title + description + canonical}>
        <title>{title}</title>
        <meta name='description' content={decodeURI(description)} />
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1' />
        <meta
          name='copyright'
          content={`
          Copyright © ${new Date().getFullYear()} Singapore: Yolo Technology Pte Ltd. All Rights Reserved.
          Philippines: Etos Adtech Corporation
        `}
        />
        <meta name='author' content='Academy' />
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
          content={`Bossjob - Career Platform for Professionals in ${getCountry()}`}
        />

        {/* Schema.org markup for Google+ */}
        <meta itemProp='name' content={title} />
        <meta itemProp='image' content={imageUrl} />
        {/* <link rel='canonical' href={canonicalPath} /> */}

        {/* Twitter Card */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='BossjobPH' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={decodeURI(description)} />
        <meta name='twitter:image' content={imageUrl} />
        <meta name='twitter:image:alt' content={decodeURI(description)} />
        <meta name='twitter:creator' content='BossjobPH' />
        {/* Google Tag Manager (gtm)  https://tagmanager.google.com */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer', '${gtmID}')
        `
          }}
        />
        <script
          // defer
          // async
          dangerouslySetInnerHTML={{
            __html: `
            window.googletag = window.googletag || {cmd: []}
          `
          }}
        ></script>
      </head>
      <body id='next-app'>
        <Providers LG={dictionary} lang={lang}>
          {/* Google Tag Manager (noscript) */}
          <noscript dangerouslySetInnerHTML={{
            __html: `
          <iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.ENV === 'production' ? 'GTM-KSGSQDR' : 'GTM-PR4Z29C'}"
          height="0" width="0" style="display:non e;visibility:hidden"></iframe>
        `}}>
          </noscript>
          <Header lang={dictionary} />
          <HamburgerMenu lang={dictionary} />
          {children}
          <AutoShowModalAppRedirect />
        </Providers>
        <Initial />
      </body>
    </html>
  )
}
