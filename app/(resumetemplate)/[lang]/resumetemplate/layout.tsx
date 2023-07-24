import Footer from 'components/Footer'
import 'components/Header/Header.module.scss'
import 'app/globals.scss'
import PublicLayout from 'app/components/publicLayout'
export const revalidate = 3600

function generateSEO() {
  return {
    title: 'Free Resume Template to Edit & Download | Bossjob.ph',
    description: 'Free resume template & sample for you to edit and download on Bossjob. Customize your resume and add career objectives, work experiences and job skills!',
    imageUrl: 'https://assets.bossjob.com/website/OGTagImage.png',
    canonical: '/resumetemplate'

  }
}
export default function Layout(props: any) {
  const { children } = props
  const seo = generateSEO()
  return (
    /* @ts-expect-error Async Server Component */
    <PublicLayout {...props} seo={seo} >
      {children}
      <Footer />
    </PublicLayout>
  )
}
