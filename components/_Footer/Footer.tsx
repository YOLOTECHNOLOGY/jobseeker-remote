'use client'
import React,{useContext}from 'react'

/* Components */
import Text from 'components/Text'
import { languageContext } from 'app/components/providers/languageProvider'

/* Images */
import {
  ChevronUpIcon,
} from 'images'

import styles from './Footer.module.scss'
import LazyLoad from '../LazyLoad'
import PC from './components/PC'
import Mobile from './components/Mobile'

const scrollToBottom = () => document.body.scrollIntoView({ behavior: 'smooth', block: 'start' })


const Footer = ({lang}:any) => {
  const contextLang =  useContext(languageContext)
  const data = lang ?? contextLang
  const {
    technology,
    corporation
  } = data?.foot ||{}
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Start of Mobile Footer */}
        <Mobile lang={lang} />
        {/* End of Mobile Footer */}

        {/* Start of Desktop Footer */}
        <PC lang={lang} />
        {/* End of Desktop Footer */}

        {/* <Text textStyle='sm' className={styles.copyright}>
          <div className={styles.copyrightWrapper}>
            <Text tagName='p' textStyle='sm'>
              Copyright © 2016-{new Date().getFullYear()}&nbsp;
            </Text>
            <div className={styles.copyrightCompanies}>
              <Text tagName='p' textStyle='sm'>
               {technology}
                <br />
                <span>{corporation}</span>
              </Text>
            </div>
          </div>
        </Text> */}
      </div>
    </footer>
  )
}

export default Footer
