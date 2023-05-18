/* eslint-disable react/no-unknown-property */
import React, { Suspense } from 'react'
import getConfigs from 'app/[lang]/interpreters/config'
import { buildComponentScript, needLogin } from 'app/[lang]/abstractModels/util'
import { serverDataScript } from 'app/[lang]/abstractModels/FetchServierComponents'
import SearchForm from './components/searchForms'
import styles from './index.module.scss'
import Table from './components/table'
import Loading from './components/table/loading'
import MainRight from './communicated/components/MainRight'
import preferences from './interpreters/preferences'
import MobileHeader from './components/mobileHeader'
import SortFilter from './components/searchForms/sortFilter'
import SortProvider from './components/searchForms/SortProvider'
import Footer from 'components/Footer'
import { getDictionary } from 'get-dictionary'
const configs = getConfigs([
  ['location_lists'],
  ['main_functions'],
  ['job_functions'],
  ['function_titles'],
  ['job_function_lists'],
  ['country_lists'],
  ['xp_lvls'],
  ['job_types'],
  ['company_sizes'],
  ['industry_lists'],
  ['currency_lists'],
  ['company_financing_stage_lists'],
  ['salary_ranges'],
  ['educations'],
  ['salary_range_filters'],
  ['job_benefit_lists'],
  ['notice_period_lists']
])

// or dynamic metadata

const Main = async (props: any) => {
  const { preferences, searchParams, config } = props
  const preferenceId = searchParams.preferenceId || preferences?.[0]?.id
  const { lang } = props.params
  const dictionary: any = await getDictionary(lang)
  return (
    <>
      <div className={styles.main}>
        <div className={styles.left}>
          <MobileHeader lang={dictionary?.myJobs} />
          <SortProvider>
            <div
              className={styles.searchFormContainer}
              // style={{ position: 'sticky', top: 0, zIndex: 20 }}
            >
              <SearchForm
                searchParams={props.searchParams ?? null}
                preferenceId={preferenceId}
                preferences={preferences}
                config={config}
                lang={dictionary}
              />
            </div>
            <SortFilter lang={dictionary?.myJobs} />
          </SortProvider>
          <div className={styles.content}>
            <div className={styles.table}>
              <Suspense fallback={<Loading />}>
                <Table
                  searchParams={searchParams ?? {}}
                  preferenceId={preferenceId}
                  preferences={preferences}
                  config={props.config}
                  lang={dictionary?.myJobs}
                />
              </Suspense>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          {/* @ts-expect-error Async Server Component */}
          <MainRight lang={dictionary?.myJobs}   config={props.config}/>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default configs(serverDataScript()).chain((configs) =>
  preferences(
    needLogin(
      serverDataScript().chain((preferences) =>
        buildComponentScript({ ...configs, preferences }, Main)
      )
    )
  )
).run
