
import Main from './main-page/page'
const defaultSEO = {
    title: 'Bossjob - Career Platform for Professionals in Philippines',
    description: 'Bossjob - Career Platform for Professionals in Philippines',
    imageUrl: 'https://assets.bossjob.com/website/OGTagImage.png',
    canonical: ''
}
export const metadata = {
    title:defaultSEO.title,
    description: defaultSEO.description,
    copyright: `
    Copyright © ${new Date().getFullYear()} Singapore: Yolo Technology Pte Ltd. All Rights Reserved.
    Philippines: Etos Adtech Corporation
  `,
    openGraph: {
        title: defaultSEO.title,
        url: defaultSEO.imageUrl,
        images: [
            {
                secureUrl: defaultSEO.url,
                width: 450,
                height: 290,
            },
        ],
        description: decodeURI(defaultSEO.description),
        siteName: defaultSEO.title,
        locale: 'enPH',
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
        initialScale: '1.0',
        maximumScale: '1.0',
        userScalable: 'no'
    },
    robots: {
        index: true,
    },
    other: {
        name: defaultSEO.title,
        image: defaultSEO.imageUrl
    }

}

export default Main