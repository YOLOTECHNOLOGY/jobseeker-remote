import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Google Ad Manager */}
          <Script defer src='https://securepubads.g.doubleclick.net/tag/js/gpt.js' />
          <Script
            dangerouslySetInnerHTML={{
              __html: `
            window.googletag = window.googletag || {cmd: []}
          `,
            }}
          />
          {/* Google AdSense */}
          <Script
            data-ad-client='ca-pub-4245733463545444'
            defer
            src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
          />
          {/* <script
            dangerouslySetInnerHTML={{
              __html: `
               (adsbygoogle = window.adsbygoogle || []).push({
                   google_ad_client: 'ca-pub-4245733463545444',
                   enable_page_level_ads: true
              });`,
            }}
          /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
