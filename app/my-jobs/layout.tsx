// import styles from './index.module.scss'

import { getCountry } from "helpers/country"

const seoMetaTitle = `My Jobs`
const description = `Bossjob - Career Platform for Professionals in ${getCountry()}`
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
  