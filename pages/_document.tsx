import Document, { Head } from 'next/document'

export default class CustomDocument extends Document {
  render() {
    return (
      <Head>
        <script
          // data-ad-client='ca-pub-4245733463545444'
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
               (adsbygoogle = window.adsbygoogle || []).push({
                   google_ad_client: 'ca-pub-4245733463545444',
                   enable_page_level_ads: true
              });
                `,
          }}
        />
      </Head>
    )
  }
}
