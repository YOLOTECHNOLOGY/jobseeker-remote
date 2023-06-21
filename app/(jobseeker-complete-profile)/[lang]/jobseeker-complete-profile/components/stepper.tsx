import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import styles from '../index.module.scss'
interface PropsType{
  step?:number,
  lang:any
}

export default function HorizontalLabelPositionBelowStepper({step,lang}: PropsType) {
  
  const isMobile =document?.body.clientWidth < 750

  const {profile:{
    workExperience,
    education,
    desiredJob
  } } =lang
  
  const steps = [
    workExperience,
    education,
    desiredJob,
      ];
    console.log({step})  
  return (
    <Box sx={{ width: '100%' }}>
      {
        isMobile ? <ul className={styles.stepMobile}>
           {steps.map((label,index) => (<li  className={index <= step ? styles.active : ''} key={label}>
             <span/>
            {label}
            </li>))}
        </ul>  : <Stepper activeStep={step} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      }
      
    </Box>
  );
}