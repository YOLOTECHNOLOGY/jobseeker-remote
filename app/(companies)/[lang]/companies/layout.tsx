import Footer from 'components/Footer'
import 'components/Header/Header.module.scss'
import 'app/[lang]/globals.scss'
import PublicLayout from 'app/[lang]/components/publicLayout'
import { getDictionary } from 'get-dictionary'
import { formatTemplateString } from 'helpers/formatter'
import { getCountryKey } from 'helpers/country'
export const revalidate = 3600

async function generateSEO({ params }) {
  const { lang }: any = params
  const dictionary = await getDictionary(lang)
  const {
    seo: { company }
  } = dictionary
  const country = dictionary.seo[getCountryKey()]
  return {
    title: formatTemplateString(company.listTitle, country),
    description: formatTemplateString(company.listDescription, country),
    imageUrl: 'https://assets.bossjob.com/website/OGTagImage.png',
    canonical: '/companies',

  }
}
export default async function Layout(props: any) {
  const { children } = props
  const seo = await generateSEO(props)
  return (
    /* @ts-expect-error Async Server Component */
    <PublicLayout {...props} seo={seo} >
      {children}
      <Footer />
    </PublicLayout>
  )
}
