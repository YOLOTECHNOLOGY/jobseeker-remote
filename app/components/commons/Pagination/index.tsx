'use client'
import React from 'react'
import { Pagination as MUIPagination } from 'app/components/MUIs'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
const Pagination = (props: any) => {
    const { count, page, pageQueryKey = 'page' } = props
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    return <MUIPagination count={count} page={page} onChange={(e, page) => {
        const newSearchParams = new URLSearchParams(searchParams.toString())
        newSearchParams.set(pageQueryKey, '' + page)
        router.push(pathname + '?' + newSearchParams.toString(), { scroll: true })
    }} />
}
export default Pagination