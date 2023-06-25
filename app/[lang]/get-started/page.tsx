/* eslint-disable react/no-unknown-property */
import React from 'react'
import getConfigs from 'app/models/interpreters/config'
import { buildComponentScript } from 'app/models/abstractModels/util'
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
import styles from './index.module.scss'
import Main from './components/main'
import Link from 'next/link'
import { getDictionary } from 'get-dictionary'

const configs = getConfigs([['location_lists']])

const Page = async (props: any) => {
  const { lang } = props.params
  const dictionary: any = await getDictionary(lang)

  const { newGetStarted } = dictionary

  return (
    <>
      <div className={styles.main}>
        <div className={styles.bg}></div>
        <div className={styles.container}>
          <h2>{newGetStarted.title}</h2>
          <Main dictionary={dictionary} />
        </div>
        <p className={styles.tips}>
          {newGetStarted.tips}
          <Link
            href={
              process.env.ENV === 'development'
                ? 'https://dev.employer.bossjob.com'
                : 'https://employer.bossjob.com'
            }
            className={styles.AuthCTALink}
          >
            {newGetStarted.employer}
          </Link>
        </p>
      </div>
    </>
  )
}

export default configs(serverDataScript().chain((props) => buildComponentScript(props, Page))).run
