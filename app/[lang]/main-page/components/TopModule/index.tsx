import React from 'react'
import PopularJob from './popularJobs'
import Ad from '../Ad/Ad'
import dynamic from 'next/dynamic'
import { cookies } from 'next/headers'
const SearchArea = dynamic(() => import('./searchArea'))
const ServerFunctionFilter = dynamic(() => import('./functionFilter/server'))
  const TopModule = (props: any) => {
  const langKey = props?.params?.lang || (cookies().get('geoConfiguration') as any)?.split('_')?.[1] || 'en-US'
  return (
    <div>
      <SearchArea {...props} langKey={langKey}/>
      <PopularJob langKey={langKey} />
      <Ad>
        <ServerFunctionFilter  langKey={langKey}  {...props} />
      </Ad>
    </div>
  )
}
export default TopModule
