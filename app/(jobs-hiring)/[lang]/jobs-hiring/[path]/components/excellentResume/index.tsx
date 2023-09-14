'use client'
import React, { useRef } from 'react'
import styles from './index.module.scss'
import { pushToResume } from 'helpers/push'
import Lottie from "lottie-react";
import excellentResumeData from "./excellentResume.json";

const ExcellentResumeBanner = ({ advertisingLink }) => {
  const handleClick = () => {
    pushToResume()
  }

  return (
    <div className={styles.container} onClick={handleClick}>
      <Lottie animationData={excellentResumeData} loop={true} />
      <span style={{ fontSize: '26px' }}>{advertisingLink.excellentResume}</span>
      <span style={{ fontSize: '18px' }}>{advertisingLink.openTheDoorToSuccess}</span>
      <span className={styles.button}>{advertisingLink.createMyResume}</span>
    </div>
  )
}
export default ExcellentResumeBanner