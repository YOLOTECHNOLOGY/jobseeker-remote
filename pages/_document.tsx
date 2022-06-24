import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Google Ad Manager */}
          <script defer async src='https://securepubads.g.doubleclick.net/tag/js/gpt.js'></script>
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
          <script
            data-ad-client='ca-pub-4245733463545444'
            src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
            defer
            async
          ></script>
          {/* <script
            dangerouslySetInnerHTML={{
              __html: `
               (adsbygoogle = window.adsbygoogle || []).push({
                   google_ad_client: 'ca-pub-4245733463545444',
                   enable_page_level_ads: true
              });`,
            }}
          /> */}

          <link href="https://fonts.googleapis.com/css?family=Product+Sans:300,400,500,700,300i,400i,500i,700i&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
