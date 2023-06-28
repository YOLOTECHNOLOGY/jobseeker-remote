import PublicLayout from 'app/components/publicLayout'
import { getDictionary } from 'get-dictionary'
import { getCountryKey } from 'helpers/country'
import { getServerLang } from 'helpers/country.server'
import { formatTemplateString } from 'helpers/formatter'

export async function generateMetadata() {
  const lang = getServerLang() as any
  const dictionary = await getDictionary(lang)

  const defaultSEO = {
    title: formatTemplateString(dictionary.seo.siteName, dictionary.seo[getCountryKey()]),
    description: formatTemplateString(dictionary.seo.metaDescription, dictionary.seo[getCountryKey()]),
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
