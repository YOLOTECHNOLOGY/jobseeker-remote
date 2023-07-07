import 'components/Header/Header.module.scss'
import 'app/globals.scss'
import PublicLayout from 'app/components/publicLayout'
import { getCountry } from 'helpers/country'
export const revalidate = 3600

async function generateSEO() {
  return {
    imageUrl: 'https://assets.bossjob.com/website/OGTagImage.png',
    title: 'Sign Up | Bossjob',
    canonical: '/register/jobseeker',
    description: `Join Bossjob to accelerate your professional career today! Access courses and job opportunities in ${getCountry()}. Network of 2 million+ professionals.`
  }
}
export default async function Layout(props: any) {
  const { children } = props
  const seo = await generateSEO()
  return (
    /* @ts-expect-error Async Server Component */
    <PublicLayout {...props} seo={seo}>
      {children}
    </PublicLayout>
  )
}
