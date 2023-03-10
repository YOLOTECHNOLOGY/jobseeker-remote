
const defaultSEO = {
  title: 'Bossjob - Career Platform for Professionals in Philippines',
  description: 'Bossjob - Career Platform for Professionals in Philippines',
  imageUrl: 'https://assets.bossjob.com/website/OGTagImage.png',
  canonical: ''
}
export default function Head() {
  const { title, description, imageUrl } = defaultSEO
  return (
    <>
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
      {/* <link rel='canonical' href={canonicalPath} /> */}

      {/* Twitter Card */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='BossjobPH' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={decodeURI(description)} />
      <meta name='twitter:image' content={imageUrl} />
      <meta name='twitter:image:alt' content={decodeURI(description)} />
      <meta name='twitter:creator' content='BossjobPH' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0 maximum-scale=1.0 user-scalable=no' />
    </>
  )
}
