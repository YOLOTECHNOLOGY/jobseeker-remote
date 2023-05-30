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
  const { config } = props
  const { lang } = props.params
  const dictionary: any = await getDictionary(lang)
  return (
    <>
      <div className={styles.main}>
         <div className={styles.bg}></div>
        <div className={styles.container}>
          <h2>Log in or sign up to Bossjob</h2>
           <Main/>
        </div>
      <p className={styles.tips}>Looking to hire people? Sign up as <span>Employer</span></p>
      </div>
    </>
  )
}

export default Page