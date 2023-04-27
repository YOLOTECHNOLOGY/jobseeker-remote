import React from "react"
import styles from './index.module.scss'
import MainLeft from "./components/MainLeft"
import MainRight from "./components/MainRight"
import { getDictionary } from 'get-dictionary'
const Page = async (props:any) => {
  const {lang} = props.params
  const dictionary:any = await getDictionary(lang);
  const newProps = {...props,lang:dictionary?.myJobs}
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <MainLeft {...newProps}/>
      </div>
        {/* @ts-expect-error Async Server Component */}
        <MainRight lang={dictionary?.myJobs}/>
    </div>
  )
}

export default Page