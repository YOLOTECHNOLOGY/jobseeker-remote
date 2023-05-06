import React from 'react'
import PopularJob from './popularJobs'
import Ad from '../Ad/Ad'
import dynamic from 'next/dynamic'
const SearchArea = dynamic(() => import('./searchArea'))
const ServerFunctionFilter = dynamic(() => import('./functionFilter/server'))
const TopModule = (props: any) => {
  return (
    <div>
      <SearchArea />
      <PopularJob />
      <Ad>
        <ServerFunctionFilter />
      </Ad>
    </div>
  )
}
export default TopModule
