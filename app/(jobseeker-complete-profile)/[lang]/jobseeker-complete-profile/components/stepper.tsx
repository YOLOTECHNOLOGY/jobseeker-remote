import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import styles from '../index.module.scss'
interface PropsType {
  step?: number
  lang: any
}

export default function HorizontalLabelPositionBelowStepper({ step, lang }: PropsType) {
  const isMobile = document?.body.clientWidth < 750

  const {
    profile: { basicInformation, workExperience, education, desiredJob }
  } = lang

  const steps = [basicInformation, workExperience, education, desiredJob]
  return (
    <Box sx={{ width: '100%' }}>
      {isMobile ? (
        <ul className={styles.stepMobile}>
          {steps.map((label, index) => (
            <li className={index <= step ? styles.active : ''} key={label}>
              <span />
              {label}
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.stepPC}>
          {steps.map((e, index) => (
            <div
              key={e}
              className={`${styles.step} ${
                index === step ? styles.stepACtive : index < step ? styles.stepFull : ''
              }`}
            >
              {index > 0 && <div className={styles.line}></div>}

              <div className={styles.shadow}>
                <div className={styles.circle}>{index + 1}</div>
              </div>
              <p>{e}</p>
            </div>
          ))}
        </div>
        // <Stepper activeStep={step} alternativeLabel orientation='vertical'>
        //   {steps.map((label) => (
        //     <Step key={label}>
        //       <StepLabel>{label}</StepLabel>
        //     </Step>
        //   ))}
        // </Stepper>
      )}
    </Box>
  )
}
