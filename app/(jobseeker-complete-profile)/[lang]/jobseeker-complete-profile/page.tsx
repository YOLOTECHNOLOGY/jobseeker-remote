/* eslint-disable react/no-unknown-property */
import React from 'react'
import getConfigs from 'app/models/interpreters/config'
import { buildComponentScript } from 'app/models/abstractModels/util'
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
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
    ['educations'],
    ['salary_range_filters'],
    ['job_benefit_lists'],
    ['main_job_function_lists'],
    ['degrees'],
    ['salary_ranges'],
    ['country_lists'],
    ['notice_period_lists'],
    ['currency_lists']
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
