import React, { Suspense } from 'react'
import query from '../interpreters/query'
import getConfigs from 'app/interpreters/config'
import { onLoadScript } from 'app/abstractModels/filterList'
import { buildComponentScript } from 'app/abstractModels/util'
import { serverDataScript } from 'app/abstractModels/FetchServierComponents'
import SearchForm from './components/searchForms'
import styles from './index.module.scss'
import Table from '../[path]/components/table'
import Loading from '../[path]/components/table/loading'
const configs = getConfigs([
    ['inputs', 'location_lists'],
    ['inputs', 'main_functions'],
    ['inputs', 'job_functions'],
    ['inputs', 'function_titles'],
    ['inputs', 'job_function_lists'],
    ['inputs', 'xp_lvls'],
    ['filters', 'educations'],
    ['inputs', 'job_types'],
    ['filters', 'salary_range_filters']
])

const Main = (props: any) => {
    return <div >
        <SearchForm config={props.config} searchValues={props.searchValues} />
        <div className={styles.content}>
            <div className={styles.table}>
                {/* <Loading/> */}
                <Suspense fallback={<Loading />}>
                    <Table searchValues={props.searchValues} config={props.config} />
                </Suspense>
            </div>
            <div className={styles.rightContent}></div>
        </div>
    </div>
}

export default configs(serverDataScript())
    .chain(configs => query(onLoadScript(configs.config))
        .chain(searchValues => query(buildComponentScript({ ...configs, searchValues }, Main))))
    .run
