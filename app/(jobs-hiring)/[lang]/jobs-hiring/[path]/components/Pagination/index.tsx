'use client'
import React, { useContext } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import { LoadingContext } from 'app/components/providers/loadingProvider'
import MaterialRoundedPagination from 'components/MaterialRoundedPagination'

const Pagination = (props: any) => {
  const { count, page, pageQueryKey = 'page' } = props
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { push } = useContext(LoadingContext)
  return (
    <div>
      <MaterialRoundedPagination
        totalPages={count}
        page={page}
        boundaryCount={1}
        onChange={(e, page) => {
          const newSearchParams = new URLSearchParams(searchParams.toString())
          newSearchParams.set(pageQueryKey, '' + page)
          push(pathname + '?' + newSearchParams.toString())
          scrollTo(0, 0)
        }}
      />
    </div>
  )
}
export default Pagination
