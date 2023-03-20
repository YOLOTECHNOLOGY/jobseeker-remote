"use client"
import React from "react";
import styles from '../index.module.scss';
import InterstedCard from "./InterstedCard";

const Resume = () => {

return (
     <div className={styles.upload}>
         <div className={styles.header}>
         Interested in me
         </div>
         <div className={styles.uploadContainer}>
              <div className={styles.interstedBox}>
              <InterstedCard/>
              <InterstedCard/>
              <InterstedCard/>
              <InterstedCard/>
              </div> 
            <button className={styles.btn}>See More</button>
         </div>
    </div> 
)
}
export default Resume;