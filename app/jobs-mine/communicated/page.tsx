import React from "react"
import styles from './index.module.scss'
import MainLeft from "./components/MainLeft"
import MainRight from "./components/MainRight"

const Page = (props) => {
  
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <MainLeft {...props}/>
      </div>
      <div className={styles.aside}>
        {/* @ts-expect-error Async Server Component */}
        <MainRight />
      </div>
    </div>
  )
}

export default Page