import React from 'react'
import query from '../interpreters/query'
import getConfigs from 'app/interpreters/config'
import { onLoadScript } from 'app/abstractModels/filterList'
import { buildComponentScript } from 'app/abstractModels/util'
import { serverDataScript } from 'app/abstractModels/FetchServierComponents'
import SearchForm from './components/searchForms'
const configs = getConfigs([
    ['inputs', 'location_lists'],
    ['inputs', 'main_functions'],
    ['inputs', 'xp_lvls'],
    ['filters', 'educations'],
    ['inputs', 'job_types'],
    ['filters', 'salary_range_filters']
])
// const expLvlList = config.inputs.xp_lvls
// const eduLevelList = config.filters.educations
// const jobTypeList = config.inputs.job_types
const Main = (props: any) => {
    return <div >
        <SearchForm config={props.config} searchValues={props.searchValues}/>
    </div>
}

export default query(onLoadScript)
    .chain(searchValues => configs(serverDataScript()
        .chain(configs => buildComponentScript({ ...configs, searchValues }, Main))
    )).run