/* eslint-disable react/no-unknown-property */
import React from 'react'
import getConfigs from 'app/[lang]/interpreters/config'
import { buildComponentScript } from 'app/[lang]/abstractModels/util'
import { serverDataScript } from 'app/[lang]/abstractModels/FetchServierComponents'
import styles from './index.module.scss'
import Main from './components/main'

import { getDictionary } from 'get-dictionary'
const configs = getConfigs([
  ['location_lists'],
])


const Page = async (props: any) => {
  const { lang } = props.params
  const dictionary: any = await getDictionary(lang)

  const { newGetStarted } = dictionary

  const BOSSHUNT_URL = process.env.BOSSHUNT_URL

  return (
    <>
      <div className={styles.main}>
         <div className={styles.bg}></div>
        <div className={styles.container}>
          <h2>{newGetStarted.title}</h2>
           <Main dictionary={dictionary} />
        </div>
      <p className={styles.tips}>{newGetStarted.tips}<a target='_blank' href={BOSSHUNT_URL} rel="noreferrer">{newGetStarted.employer}</a></p>
      </div>
    </>
  )
}

export default configs(serverDataScript().chain(props => buildComponentScript(props, Page))).run