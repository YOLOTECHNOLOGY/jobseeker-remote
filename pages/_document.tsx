import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Google Ad Manager */}
          {/* <script defer async src='https://securepubads.g.doubleclick.net/tag/js/gpt.js'></script> */}
          <script
            defer
            async
            dangerouslySetInnerHTML={{
              __html: `
            window.googletag = window.googletag || {cmd: []}
          `,
            }}
          ></script>
          {/* Google AdSense */}
          {/* <script
            data-ad-client='ca-pub-4245733463545444'
            src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
            defer
            async
          ></script> */}
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
          {/* Google Tag Manager (noscript) */}
          <noscript dangerouslySetInnerHTML={{ __html: `
            <iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.ENV === 'production' ? 'GTM-KSGSQDR' : 'GTM-PR4Z29C'}"
            height="0" width="0" style="display:non e;visibility:hidden"></iframe>
          `}}>
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
