/* eslint-disable react/no-unknown-property */
import React, { Suspense } from 'react'
import getConfigs from 'app/interpreters/config'
import { buildComponentScript, needLogin } from 'app/abstractModels/util'
import { serverDataScript } from 'app/abstractModels/FetchServierComponents'
import SearchForm from './components/searchForms'
import styles from './index.module.scss'
import Table from './components/table'
import Loading from './components/table/loading'
import MainRight from './communicated/components/MainRight'
import LoadingProvider from 'app/components/providers/loadingProvider'
import preferences from './interpreters/preferences'
import SortProvider from './components/searchForms/SortProvider'
const configs = getConfigs([
    ['inputs', 'location_lists'],
    ['inputs', 'main_functions'],
    ['inputs', 'job_functions'],
    ['inputs', 'function_titles'],
    ['inputs', 'job_function_lists'],
    ['inputs', 'country_lists'],
    ['inputs', 'xp_lvls'],
    ['inputs', 'job_types'],
    ['inputs', 'company_sizes'],
    ['inputs', 'industry_lists'],
    ['inputs', 'currency_lists'],
    ['inputs', 'company_financing_stage_lists'],
    ['inputs', 'salary_ranges'],
    ['filters', 'educations'],
    ['filters', 'salary_range_filters']
])

// or dynamic metadata


const Main = (props: any) => {
    console.log({ props })
    const { preferences, searchParams, config } = props
    const preferenceId = searchParams.preferenceId || preferences?.[0]?.id
    return <LoadingProvider >
        <div className={styles.main}>
            <div>
            <SortProvider>
                <div style={{ position: 'sticky', top: 0, zIndex: 20 }}>
                    <SearchForm
                        searchParams={props.searchParams ?? null}
                        preferenceId={preferenceId}
                        preferences={preferences}
                        config={config}
                    />
                </div>
                </SortProvider>
                <div className={styles.content}>
                    <div className={styles.table}>
                        <Suspense fallback={<Loading />}>
                            <Table
                                searchParams={searchParams ?? {}}
                                preferenceId={preferenceId}
                                preferences={preferences}
                                config={props.config}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
            {/* @ts-expect-error Async Server Component */}
            <div className={styles.aside}><MainRight /></div>
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
