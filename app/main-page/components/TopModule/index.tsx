import React from 'react'
import PopularJob from './popularJobs'
import SearchArea from './searchArea'
import ServerFunctionFilter from './functionFilter/server'

const TopModule = (props:any) => {
  const { config } = props
  return (
    <div>
      <SearchArea {...props} />
      <PopularJob />
      <ServerFunctionFilter config={config} />
    </div>
  )
}
export default TopModule
