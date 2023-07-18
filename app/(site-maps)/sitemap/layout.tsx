import Footer from 'components/Footer'
import 'components/Header/Header.module.scss'
import 'app/globals.scss'
import PublicLayout from 'app/components/publicLayout'
import { formatTemplateString } from 'helpers/formatter'
import { getDictionary } from 'get-dictionary'
import { getCountryKey } from 'helpers/country'
export const revalidate = 3600

export default async function Layout(props: any) {
  const { children, params: { lang } } = props
  const dictionary = await getDictionary(lang)
  const defaultSEO = {
    title: formatTemplateString(dictionary.seo.siteName, dictionary.seo[getCountryKey()]),
    description: formatTemplateString(dictionary.seo.metaDescription, dictionary.seo[getCountryKey()]),
    imageUrl: 'https://assets.bossjob.com/website/OGTagImage.png',
    canonical: ''
  }
  return (
    /* @ts-expect-error Async Server Component */
    <PublicLayout {...props} seo={defaultSEO} >
      {children}
      <Footer />
    </PublicLayout>
  )
}
