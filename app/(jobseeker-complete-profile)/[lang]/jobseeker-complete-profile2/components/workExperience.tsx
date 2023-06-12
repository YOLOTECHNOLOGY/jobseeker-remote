import React, { useState, useEffect } from 'react'
import styles from '../index.module.scss'
import Header from './Header'
import Stepper from './stepper'
import LoadingButton from '@mui/lab/LoadingButton'
import Text from 'components/Text'
import { maxFileSize } from 'helpers/handleInput'
import MaterialDatePicker from 'components/MaterialDatePicker'
import JobFunctionSelector from 'components/JobFunctionSelector'
import FormControlLabel from '@mui/material/FormControlLabel'
import MaterialTextField from 'components/MaterialTextField'
import Switch from '@mui/material/Switch'
import Chip from '@mui/material/Chip';
import TextEditor from 'components/TextEditor/TextEditor'
const WorkExperience = (props: any) => {
  console.log(props)
  const { lang } = props
  const [resume, setResume] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const redirect = '/jobseeker-complete-profile/1101'
  const [isDoneUpdating, setIsDoneUpdating] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [workPeriodFrom, setWorkPeriodFrom] = useState(null)
  const [jobFunction, setJobFunction] = useState({ id: undefined, value: '' })
  const [companyName, setCompanyName] = useState('')
  const [isCurrentJob, setIsCurrentJob] = useState(false)
  const [workPeriodTo, setWorkPeriodTo] = useState(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false);
  function handleClick() {
    // setLoading(true);
  }
  const {
    companyNameText = 'Company name',
    currentlyWorkHere = 'I currently work here',
    monthYear = 'From',
    placeholder = 'Text'
  } = lang?.profile || {}
  useEffect(() => {
    if (resume) {
      if (maxFileSize(resume, 5)) {
        setErrorMessage('')
        if (localStorage.getItem('isCreateFreeResume'))
          localStorage.removeItem('isCreateFreeResume')
        setIsDoneUpdating(true)

        const payload = {
          redirect,
          resume
          // accessToken
        }
        //  dispatch(uploadUserResumeRequest(payload))
      } else {
        setErrorMessage(lang?.profile?.fileTooHuge)
      }

      setIsDisabled(false)
    }
  }, [resume])
  const requiredLabel = (text: string) => {
    return (
      <>
        <span>{text}</span>
        <span className={styles.stepFieldRequired}>*</span>
      </>
    )
  }
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };
  return (
    <div className={styles.work}>
      <Header />
      <div className={styles.workContainer}>
        <Stepper />
        <div className={styles.box}>
          <div className={styles.headerInfo}>Work experience</div>
          <div className={styles.body}>
            <p className={styles.title}>Autofill my info</p>
            <p className={styles.titleTip}>Save time by importing your resume</p>
            <div className={styles.upload}>
              <LoadingButton
                loading={false}
                variant='contained'
                component='label'
                sx={{
                  textTransform: 'capitalize',
                  width: '330px',
                  height: '44px',
                  border: '1px solid #136FD3',
                  borderRadius: '10px',
                  background: '#fff',
                  boxShadow: 'none',
                  color: '#136FD3'
                }}
              >
                <Text textColor='#136FD3' bold>
                  Upload resume
                </Text>
                <input
                  type='file'
                  hidden
                  accept='.pdf, .doc, .docx'
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </LoadingButton>
            </div>
            <p className={styles.titleTip}>
              Supported file type: PDF, DOC, DOCX. Max. file size: 5MB
            </p>
            <p className={styles.title}>
              Autofill my info <span>*</span>
            </p>
            <div className={styles.stepFieldDateItem}>
              <MaterialDatePicker
                label={'Month year'}
                views={['year', 'month']}
                inputFormat='MMM yyyy'
                value={workPeriodFrom}
                fullWidth
                onDateChange={(value) => {
                  setWorkPeriodFrom(value)
                }}
              />
            </div>
            <p className={styles.title}>
              Most recent job title <span>*</span>
            </p>
            <div id='jobFunction' className={styles.stepField}>
              <JobFunctionSelector
                className={styles.stepFullwidth}
                label={lang?.profile?.jobFunction}
                title={lang?.profile?.jobFunction}
                lang={lang}
                name='jobFunction'
                isTouched
                fullWidth
                value={jobFunction}
                onChange={(value) => setJobFunction(value)}
              />
            </div>

            <p className={styles.title}>
              Most recent company <span>*</span>
            </p>
            <div className={styles.stepField}>
              <MaterialTextField
                className={styles.stepFullwidth}
                label={requiredLabel(companyNameText)}
                size='small'
                fullWidth
                value={companyName}
                defaultValue={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <p className={`${styles.title} ${styles.titlePeriod}`}>
              Working period* <span>*</span>
            </p>
            <div className={styles.stepFieldBody}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isCurrentJob}
                    onChange={() => setIsCurrentJob(!isCurrentJob)}
                    name='currentJob'
                  />
                }
                label={<Text textStyle='base'>{currentlyWorkHere}</Text>}
              />
              <div className={styles.stepFieldToItem}>
                <MaterialDatePicker
                  label={monthYear}
                  views={['year', 'month']}
                  inputFormat='MMM yyyy'
                  value={workPeriodTo}
                  onDateChange={(value) => {
                    setWorkPeriodTo(value)
                  }}
                />
              </div>
            </div>

            <p className={`${styles.title} ${styles.titlePeriod}`}>
              Skills
            </p>
            <p className={styles.titleTip}>
            Skills will be suggested based on selected job function. Please select max 5 skills.
            </p>
             <div className={styles.chooseSkill}>
              <p >Select skills or type your own skills</p>
              <Chip sx={{
                background:"#136FD3"
              }} color="primary" label="Deletable" onDelete={handleDelete} />
             </div>

             <p className={`${styles.title} ${styles.titlePeriod}`}>
             Description
            </p>

            <div className={styles.step3Editor}>
              <TextEditor value={description} setValue={setDescription} placeholder={placeholder} />
            </div>




          </div>
        </div>
        <div className={styles.next}>
     
     <LoadingButton
       onClick={handleClick}
       loading={loading}    
       variant="contained"
       sx={{
         width:'202px',
         height:'44px',
         textTransform: 'capitalize',
         background:  "#F0F0F0",
         color: "#707070",
         boxShadow:'none',
         borderRadius: '10px'
       }}
     >
       <span>Next (1/4)</span>
     </LoadingButton>
     <LoadingButton
       onClick={handleClick}
       loading={loading}    
       variant="contained"
       sx={{
         width:'202px',
         height:'44px',
         textTransform: 'capitalize',
         border: '1px solid #136FD3',
         background:  "transparent",
         color: '#136FD3',
         boxShadow:'none',
         borderRadius: '10px'
       }}
     >
       <span>back</span>
     </LoadingButton>
   </div>
      </div>
   
    </div>
  )
}

export default WorkExperience
