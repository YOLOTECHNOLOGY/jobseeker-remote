/* eslint-disable react/no-unknown-property */
import React from 'react'
import getConfigs from 'app/[lang]/interpreters/config'
import { buildComponentScript } from 'app/[lang]/abstractModels/util'
import { serverDataScript } from 'app/[lang]/abstractModels/FetchServierComponents'
import styles from './index.module.scss'
import { getDictionary } from 'get-dictionary'
import Main from './components/main'
const configs = getConfigs(
  [
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
    ['country_lists'],
    ['notice_period_lists']
  ]
  )

const Page = async (props: any) => {
  const { lang } = props.params
  const dictionary: any = await getDictionary(lang)

  const dic = dictionary
  const newProps = {...props,lang:dic}
  return (
    <>
      <div className={styles.main}>
        <Main {...newProps}/>
      </div>
    </>
  )
}

export default configs(serverDataScript().chain((props) => buildComponentScript(props, Page))).run
