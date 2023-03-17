import React  from "react"
import Header from "./components/Header"
import styles from './page.module.scss'
import JobCard from './components/JobCard'
import Resume from "./components/Resume"
import InterestedMe from "./components/InterestedMe"
import ViewedMe from './components/ViewedMe'
const Page = () => {
    return (
      <div className={styles.container}>
         <div className={styles.main}> 
           <Header />
           <p className={styles.time}>12 Jan 2023</p>
           <JobCard/>
         </div>
         <div className={styles.aside}>
            <Resume/>
            <InterestedMe/>
            <ViewedMe/>
         </div>
      </div>
    )
  }
  
  export default Page