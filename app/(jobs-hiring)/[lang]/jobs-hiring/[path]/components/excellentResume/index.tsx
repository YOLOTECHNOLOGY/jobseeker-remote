'use client'
import React, { useRef } from 'react'
import styles from './index.module.scss'
import { pushToResume } from 'helpers/push'
import Lottie from "lottie-react";
import excellentResumeData from "./excellentResume.json";

const ExcellentResumeBanner = () => {
  const handleClick = () => {
    pushToResume()
  }

  return (
    <div className={styles.container} onClick={handleClick}>
      <Lottie animationData={excellentResumeData} loop={true} />
      <span style={{ fontSize: '26px' }}>excellent resume</span>
      <span style={{ fontSize: '18px' }}>open the door to success</span>
      <span className={styles.button}>Create My resume</span>
    </div>
  )
}
export default ExcellentResumeBanner