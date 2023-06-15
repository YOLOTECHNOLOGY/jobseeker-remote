import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

interface PropsType{
  step?:number,
  lang:any
}

export default function HorizontalLabelPositionBelowStepper({step,lang}: PropsType) {
  
  const {profile:{
    workExperience,
    educationExperience,
    desiredJob
  } } =lang
  
  const steps = [
    workExperience,
    educationExperience,
    desiredJob,
      ];
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={step} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}