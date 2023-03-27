/* eslint-disable react/no-unknown-property */
import React, { Suspense } from 'react'
import getConfigs from 'app/interpreters/config'
import { buildComponentScript, needLogin } from 'app/abstractModels/util'
import { serverDataScript } from 'app/abstractModels/FetchServierComponents'
import SearchForm from './components/searchForms'
import styles from './index.module.scss'
import Table from './components/table'
import Loading from './components/table/loading'

import LoadingProvider from 'app/components/providers/loadingProvider'
import preferences from './interpreters/preferences'

const configs = getConfigs([
    ['inputs', 'location_lists'],
    ['inputs', 'main_functions'],
    ['inputs', 'job_functions'],
    ['inputs', 'function_titles'],
    ['inputs', 'job_function_lists'],
    ['inputs', 'xp_lvls'],
    ['inputs', 'job_types'],
    ['inputs', 'company_sizes'],
    ['inputs', 'industry_lists'],
    ['inputs', 'company_financing_stage_lists'],
    ['filters', 'educations'],
    ['filters', 'salary_range_filters']
])

// or dynamic metadata


const Main = (props: any) => {
    console.log({props})
    return <LoadingProvider >
        <div>
            <div style={{ position: 'sticky', top: 0, zIndex: 20 }}>
                <SearchForm config={props.config} searchValues={props.searchValues ?? null} />
            </div>
            <div className={styles.content}>
                <div className={styles.table}>
                    <Suspense fallback={<Loading />}>
                        <Table searchValues={props.searchValues ?? null} config={props.config} />
                    </Suspense>
                </div>
            </div>
        </div>
    </LoadingProvider>
}

export default configs(serverDataScript())
    .chain(configs => preferences(
        needLogin(
            serverDataScript()
                .chain(preferences => buildComponentScript({ ...configs, preferences }, Main))
        )))
    .run
