import React from "react"
import styles from './index.module.scss'
import MainLeft from "./components/MainLeft"
import MainRight from "./components/MainRight"
import { getDictionary } from 'get-dictionary'
import interpreter from "./intepreter"
import { serverDataScript } from "app/[lang]/abstractModels/FetchServierComponents"
import { buildComponentScript } from "app/[lang]/abstractModels/util"
const Page = async (props:any) => {
  const {lang} = props.params
  const dictionary:any = await getDictionary(lang);
  const newProps = {...props,lang:dictionary?.myJobs,langKey:lang}
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <MainLeft {...newProps}/>
      </div>
        {/* @ts-expect-error Async Server Component */}
        <MainRight lang={dictionary?.myJobs} config={props.config}/>
    </div>
  )
}

// export default Page
export default interpreter(serverDataScript().chain(props => buildComponentScript(props, Page))).run