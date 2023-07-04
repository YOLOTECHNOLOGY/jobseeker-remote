/* eslint-disable react/no-unknown-property */
import React, { Suspense } from 'react'
import query from '../interpreters/query'
import getConfigs from 'app/models/interpreters/config'
import { onLoadScript } from 'app/models/abstractModels/filterList'
import { buildComponentScript } from 'app/models/abstractModels/util'
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
import SearchForm from './components/searchForms'
import styles from './index.module.scss'
import Table from './components/table'
import Loading from './components/table/loading'
import UploadResumeButton from './components/UploadResumeButton'
import { cookies } from 'next/headers'
import searchHistoryIp from '../interpreters/searchHistory'
import SearchHistories from './components/searchHistories'
import JobAlert from './components/jobAlert'
import Footer from 'components/Footer'
import { getDictionary } from 'get-dictionary'
import QrCode from './components/QrCode'

const configs = getConfigs([
  ['location_lists'],
  ['main_functions'],
  ['job_functions'],
  ['function_titles'],
  ['job_function_lists'],
  ['xp_lvls'],
  ['job_types'],
  ['company_sizes'],
  ['industry_lists'],
  ['company_financing_stage_lists'],
  ['educations'],
  ['salary_range_filters'],
  ['job_benefit_lists'],
  ['main_job_function_lists'],
  ['degrees'],
  ['salary_ranges'],
  ['subscibe_job_frequency_lists'],
  ['country_lists']
])


const SearchHistory = searchHistoryIp(
  serverDataScript().chain((list) => buildComponentScript({ list }, SearchHistories))
).run

const Main = async (props: any) => {
  const { lang } = props.params
  const { search } = (await getDictionary(lang)) as any

  const accessToken = cookies().get('accessToken')?.value
  const location = props.searchValues?.location?.[0]
  return (
    <>
      <div>
        {/* Search From */}
        <div style={{ position: 'sticky', top: 0, zIndex: 90 }}>
          <SearchForm config={props.config} lang={lang} searchValues={props.searchValues ?? null} />
        </div>
        
        {/* Main Content */}
        <div className={styles.contentWrap}>

          {/* Content */}
          <div className={styles.content}>

            {/* left */}
            <div className={styles.table}>

              {/* job Alert */}
              {accessToken ? <JobAlert searchValues={props.searchValues} config={props.config} /> : null}

              {/* <Loading/> */}
              <Suspense fallback={<Loading />}>
                <Table
                  searchValues={props.searchValues ?? null}
                  lang={search}
                  config={props.config}
                />
              </Suspense>
            </div>

            {/* right */}
            <div className={styles.rightContent}>
              <UploadResumeButton
                text={search.uploadResume}
                isShowBtn={!accessToken}
                isShowArrowIcon={false}
                className={styles.arrowIconPostion}
              />
              <SearchHistory
                location={location}
                value={props?.searchValues?.query as any}
                path={props.params?.path}
                lang={search}
              />
            </div>
          </div>
        </div>

        {/* Download APP QrCode */}
        <QrCode lang={search} />
      </div>
      {/* Footer */}
      <Footer />
    </>
  )
}

export default configs(serverDataScript()).chain((configs) =>
  query(onLoadScript(configs.config)).chain((searchValues) =>
    query(buildComponentScript({ ...configs, searchValues }, Main))
  )
).run
