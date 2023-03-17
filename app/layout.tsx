// 'use client'
// import Providers from './components/providers'
import Header from 'components/Header'
import './globals.scss'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import HamburgerMenu from 'components/HamburgerMenu'
const defaultSEO = {
  title: 'Bossjob - Career Platform for Professionals in Philippines',
  description: 'Bossjob - Career Platform for Professionals in Philippines',
  imageUrl: 'https://assets.bossjob.com/website/OGTagImage.png',
  canonical: ''
}
export const metadata: Metadata = {
  title: defaultSEO.title,
  description: defaultSEO.description,
  //     copyright: `
  //   Copyright © ${new Date().getFullYear()} Singapore: Yolo Technology Pte Ltd. All Rights Reserved.
  //   Philippines: Etos Adtech Corporation
  // `,
  openGraph: {
    title: defaultSEO.title,
    url: defaultSEO.imageUrl,
    images: {
      secureUrl: defaultSEO.imageUrl,
      width: '450',
      height: '290',
      url: defaultSEO.imageUrl
    },

    description: decodeURI(defaultSEO.description),
    siteName: defaultSEO.title,
    locale: 'enPH'
  },

  twitter: {
    card: 'summary_large_image',
    site: 'BossjobPH',
    title: defaultSEO.title,
    description: decodeURI(defaultSEO.description),
    creator: 'BossjobPH'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1.0,
    maximumScale: 1.0,
    userScalable: false
  },
  robots: {
    index: true
  },
  other: {
    name: defaultSEO.title,
    image: defaultSEO.imageUrl
  }
}

const Providers = dynamic(() => import('./components/providers'), { ssr: true })
const Initial = dynamic(() => import('./components/Initals'), { ssr: false })
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { title, imageUrl, description, canonical } = defaultSEO
  return (
    <html lang='en'>
      <head key={title + description + canonical}>
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
        {/* <link rel='canonical' href={canonicalPath} /> */}

        {/* Twitter Card */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='BossjobPH' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={decodeURI(description)} />
        <meta name='twitter:image' content={imageUrl} />
        <meta name='twitter:image:alt' content={decodeURI(description)} />
        <meta name='twitter:creator' content='BossjobPH' />
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
        <Providers>
          <Header />
          <HamburgerMenu />
          {children}
        </Providers>
        <Initial />
      </body>
    </html>
  )
}
