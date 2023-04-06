// import styles from './index.module.scss'

const seoMetaTitle = `My Jobs`
const description = 'Bossjob - Career Platform for Professionals in Philippines'
export const  metadata = {
  title: seoMetaTitle,
  description: description,
}
export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
        {children}
      </>
  
    )
  }
  