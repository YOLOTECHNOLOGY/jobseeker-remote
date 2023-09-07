// 'use client'
// import Providers from './components/providers'
import Header from 'components/Header'
import dynamic from 'next/dynamic'
import HamburgerMenu from 'components/HamburgerMenu'
import AutoShowModalAppRedirect from 'app/(main-page)/components/AutoShowModalAppRedirect'
import { getCountryKey } from 'helpers/country'
import { getDictionary } from 'get-dictionary'
import React, { Suspense } from 'react'
import 'app/globals.scss'
import 'app/index.module.scss'
import { formatTemplateString } from 'helpers/formatter'
import LinkProvider from 'app/components/providers/linkProvider'
import { getServerLang } from 'helpers/country.server'
import Script from 'next/script'
import bossjobClient from 'helpers/bossjobRemoteClient'
import { fetchConfigService } from 'store/services/config/fetchConfig'
import { fetchUserOwnDetailService } from 'store/services/users/fetchUserOwnDetail'
import { cookies } from 'next/headers'
const Providers = dynamic(() => import('app/components/providers'), { ssr: true })
const Initial = dynamic(() => import('app/components/Initals'), { ssr: true })
export default async function PublicLayout(props: any) {
  const gtmID = process.env.ENV === 'production' ? 'GTM-KSGSQDR' : 'GTM-PR4Z29C'
  const { children, seo = {}, position }: any = props
  const { title = '', imageUrl = '', description = '', canonical = '' } = seo
  let { lang, chat_id } = props.params
  lang = lang || getServerLang()
  const dictionary = await getDictionary(lang)
  const config = await fetchConfigService(lang)
  const accessToken = cookies().get('accessToken')?.value

  const userDetailRes = await fetchUserOwnDetailService({ accessToken })
    .catch(e => {
      console.log({ e })
      return {}
    })
  const data = {
    config,
    lang,
    chatDictionary: dictionary?.chat ?? {},
    chat_id,
    userDetail: userDetailRes?.data?.data
  }
  const chatModule = await bossjobClient.connectModule({
    id: 'chat',
    baseUrl: 'http://localhost:3000',
    initialProps: data,
    initalSharedData: {
      CHAT_ID: +chat_id ? chat_id : null,
    }
  })
  const thirdModule = await bossjobClient.connectModule({
    id: 'third',
    baseUrl: 'http://localhost:3000',
    ssr: true
    // initialProps: data,
    // initalSharedData: {
    //   CHAT_ID: +chat_id ? chat_id : null,
    // }
  })
  console.log({ thirdModule })
  return (
    <html lang={lang} translate='no'>
      <head key={title + description + canonical}>
        <title>{title}</title>
        {chatModule.inHead}
        {thirdModule.inHead}
        <meta name='description' content={decodeURI(description)} />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        />
        <link
          rel="preload"
          href="/font/product-sans/ProductSansBold.ttf"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/font/product-sans/ProductSansBoldItalic.ttf"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/font/product-sans/ProductSansItalic.ttf"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/font/product-sans/ProductSansRegular.ttf"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/font/Poppins-Bold.ttf"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
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
        <meta property='og:locale' content={lang} />
        <meta
          property='og:site_name'
          content={formatTemplateString(dictionary.seo.siteName, dictionary.seo[getCountryKey()])}
        />

        {/* Schema.org markup for Google+ */}
        <meta itemProp='name' content={title} />
        <meta itemProp='image' content={imageUrl} />
        <link rel='canonical' href={canonical} />

        {/* Twitter Card */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='BossjobPH' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={decodeURI(description)} />
        <meta name='twitter:image' content={imageUrl} />
        <meta name='twitter:image:alt' content={decodeURI(description)} />
        <meta name='twitter:creator' content='BossjobPH' />
        {/* Google Tag Manager (gtm)  https://tagmanager.google.com */}
        <Script>{`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer', '${gtmID}')
        `}
        </Script>

        <Script >{`
        window.googletag = window.googletag || {cmd: []}
      `}</Script>
      </head>
      <body >
        {thirdModule.inBody}
        {chatModule.inBody}
        <div id='next-app'>
          <Providers LG={dictionary} lang={lang}>
            {/* Google Tag Manager (noscript) */}
            <noscript
              dangerouslySetInnerHTML={{
                __html: `
          <iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.ENV === 'production' ? 'GTM-KSGSQDR' : 'GTM-PR4Z29C'
                  }"
          height="0" width="0" style="display:non e;visibility:hidden"></iframe>
        `
              }}
            ></noscript>
            <Header lang={dictionary} position={position} />
            <HamburgerMenu lang={dictionary} />
            <LinkProvider>
              {thirdModule.component}
              {chatModule.component}
              {children}
            </LinkProvider>
            <AutoShowModalAppRedirect />
          </Providers>
          <Initial />
        </div>


      </body>
    </html>
  )
}
