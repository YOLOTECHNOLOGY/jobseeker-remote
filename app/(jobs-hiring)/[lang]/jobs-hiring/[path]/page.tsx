/* eslint-disable react/no-unknown-property */
import React, { Suspense } from 'react'
import query from '../interpreters/query'
import getConfigs from 'app/[lang]/interpreters/config'
import { onLoadScript } from 'app/[lang]/abstractModels/filterList'
import { buildComponentScript } from 'app/[lang]/abstractModels/util'
import { serverDataScript } from 'app/[lang]/abstractModels/FetchServierComponents'
import SearchForm from './components/searchForms'
import styles from './index.module.scss'
import Table from './components/table'
import Loading from './components/table/loading'
import UploadResumeButton from './components/UploadResumeButton'
import { cookies } from 'next/headers'
import searchHistoryIp from '../interpreters/searchHistory'
import SearchHistories from './components/searchHistories'
import Image from 'next/image'
import { AppDownQRCode } from 'images'
import JobAlert from './components/jobAlert'
import Footer from 'components/Footer'
import { getDictionary } from 'get-dictionary'
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
  ['country_lists'],
])

const QRCode = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    transform='translate(-2,3)'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M11 2.5H13.5V5' stroke='white' strokeLinecap='round' strokeLinejoin='round' />
    <path d='M5 13.5H2.5V11' stroke='white' strokeLinecap='round' strokeLinejoin='round' />
    <path d='M13.5 11V13.5H11' stroke='white' strokeLinecap='round' strokeLinejoin='round' />
    <path d='M2.5 5V2.5H5' stroke='white' strokeLinecap='round' strokeLinejoin='round' />
    <path
      d='M10.5 5H5.5C5.22386 5 5 5.22386 5 5.5V10.5C5 10.7761 5.22386 11 5.5 11H10.5C10.7761 11 11 10.7761 11 10.5V5.5C11 5.22386 10.7761 5 10.5 5Z'
      stroke='white'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

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
        <div style={{ position: 'sticky', top: 0, zIndex: 90 }}>
          <SearchForm config={props.config} lang={lang} searchValues={props.searchValues ?? null} />
        </div>
        <div className={styles.content}>
          <div className={styles.table}>
            {/* <Loading/> */}
            <Suspense fallback={<Loading />}>
              <Table searchValues={props.searchValues ?? null} lang={search} config={props.config} />
            </Suspense>
          </div>
          <div className={styles.rightContent}>
            <UploadResumeButton
              text={search.uploadResume}
              isShowBtn={!accessToken}
              isShowArrowIcon={false}
              className={styles.arrowIconPostion}
            />
            <JobAlert searchValues={props.searchValues} config={props.config} />
            <div className={styles.qrCode}>
              <Image src={AppDownQRCode} alt='app down' width='85' height='88' />
              <div className={styles.rightContainer}>
                <label>{search.chatBoss}</label>
                <p>
                  <QRCode />
                  {search.QRCode}
                </p>
              </div>
            </div>
            <SearchHistory
              location={location}
              value={props?.searchValues?.query as any}
              path={props.params?.path}
              lang={search}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default configs(serverDataScript()).chain((configs) =>
  query(onLoadScript(configs.config)).chain((searchValues) =>
    query(buildComponentScript({ ...configs, searchValues }, Main))
  )
).run
