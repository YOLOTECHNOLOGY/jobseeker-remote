import PublicLayout from 'app/components/publicLayout'
import { getDictionary } from 'get-dictionary'
import { getCountryKey, getLang } from 'helpers/country'
import { formatTemplateString } from 'helpers/formatter'

export async function generateMetadata() {
  const lang = getLang()
  const dictionary = await getDictionary(lang)

  const defaultSEO = {
    title: formatTemplateString(dictionary.seo.siteName, dictionary.seo[getCountryKey()]),
    description: formatTemplateString(dictionary.seo.siteName, dictionary.seo[getCountryKey()]),
    imageUrl: 'https://assets.bossjob.com/website/OGTagImage.png',
    canonical: ''
  }

  return defaultSEO
}

export default async function RootLayout(props: any) {
  const { children } = props
  const defaultSEO = await generateMetadata()

  return (
    /* @ts-expect-error Async Server Component */
    <PublicLayout {...props} seo={defaultSEO}>
      {children}
    </PublicLayout>
  )
}
