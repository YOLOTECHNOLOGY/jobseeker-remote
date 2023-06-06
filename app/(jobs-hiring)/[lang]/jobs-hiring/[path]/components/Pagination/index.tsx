'use client'
import React, { useContext } from 'react'
import { Pagination as MUIPagination } from 'app/[lang]/components/MUIs'
import { useSearchParams, usePathname } from 'next/navigation'
import { LoadingContext } from 'app/[lang]/components/providers/loadingProvider'
const Pagination = (props: any) => {
  const { count, page, pageQueryKey = 'page' } = props
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { push } = useContext(LoadingContext)
  return (
    <MUIPagination
      // style={{position:'sticky',bottom:0,left:0}}
      count={count}
      page={page}
      onChange={(e, page) => {
        const newSearchParams = new URLSearchParams(searchParams.toString())
        newSearchParams.set(pageQueryKey, '' + page)
        push(pathname + '?' + newSearchParams.toString())
        scrollTo(0, 0)
      }}
    />
  )
}
export default Pagination
