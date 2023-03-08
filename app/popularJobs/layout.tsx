import { Suspense } from 'react'
import Loading from './loading'
import Page from './page'

export default function CustLeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loading />}>
      <Page />
    </Suspense>
  )
}
