/* eslint-disable react/no-unknown-property */
import React from 'react'
import getConfigs from 'app/models/interpreters/config'
import { buildComponentScript } from 'app/models/abstractModels/util'
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
import styles from './index.module.scss'
import Main from './components/main'
import { getDictionary } from 'get-dictionary'

const configs = getConfigs([['location_lists']])

const Page = async (props: any) => {
  const { lang } = props.params
  const dictionary: any = await getDictionary(lang)

  return (
    <>
      <div className={styles.main}>
        <div className={styles.bg}></div>
        <div className={styles.container}>
          <Main dictionary={dictionary} />
        </div>
      </div>
    </>
  )
}

export default configs(serverDataScript().chain((props) => buildComponentScript(props, Page))).run
