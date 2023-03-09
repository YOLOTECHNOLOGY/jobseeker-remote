import React from 'react'
import PopularJob from './popularJobs'
import SearchArea from './searchArea'


const TopModule = (props) => {
    
    return (
    <div>
        <SearchArea {...props}/>
        <PopularJob />
    </div>
    )
}
export default TopModule