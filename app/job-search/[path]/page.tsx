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
import UploadResumeButton from './components/UploadResumeButton'
import { cookies } from 'next/headers'
const configs = getConfigs([
    ['inputs', 'location_lists'],
    ['inputs', 'main_functions'],
    ['inputs', 'job_functions'],
    ['inputs', 'function_titles'],
    ['inputs', 'job_function_lists'],
    ['inputs', 'xp_lvls'],
    ['inputs', 'job_types'],
    ['inputs', 'company_sizes'],
    ['inputs', 'company_financing_stage_lists'],
    ['filters', 'educations'],
    ['filters', 'salary_range_filters']
])

const Main = (props: any) => {
    const accessToken = cookies().get('accessToken')?.value
    return <div >
        <div style={{ position: 'sticky', top: 0, zIndex: 20 }}>
            <SearchForm config={props.config} searchValues={props.searchValues ?? null} />
        </div>
        <div className={styles.content}>
            <div className={styles.table}>
                {/* <Loading/> */}
                <Suspense fallback={<Loading />}>
                    <Table searchValues={props.searchValues ?? null} config={props.config} />
                </Suspense>
            </div>
            <div className={styles.rightContent}>
                <UploadResumeButton
                    isShowBtn={!accessToken}
                    // handleClick={handleQuickUploadResumeClick}
                    isShowArrowIcon={false}
                    className={styles.arrowIconPostion}
                />

            </div>
        </div>
    </div>
}

export default configs(serverDataScript())
    .chain(configs => query(onLoadScript(configs.config))
        .chain(searchValues => query(buildComponentScript({ ...configs, searchValues }, Main))))
    .run
