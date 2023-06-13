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
import FootBtn from './footBtn'
import { useRouter, usePathname } from 'next/navigation'
import { uploadUserResumeServiceNew } from 'store/services/users/uploadUserResume'
import {differenceBy } from 'lodash-es'
const WorkExperience = (props: any) => {
  console.log(props,9999)
  const { lang ,userDetail} = props
  const {id} = userDetail
  const [resume, setResume] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [isDisabled, setIsDisabled] = useState(false)
  const [workPeriodFrom, setWorkPeriodFrom] = useState<any>(null)
  const [jobFunction, setJobFunction] = useState<any>({ id: undefined, value: '' })
  const [companyName, setCompanyName] = useState<string>('')
  const [isCurrentJob, setIsCurrentJob] = useState<boolean>(false)
  const [workPeriodTo, setWorkPeriodTo] = useState<any>(null)
  const [description, setDescription] = useState<string>('')
  const [skills, setSkills] = useState<any>([])
  const [selectedSkills, setSelectedSkills] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter()
  const pathname = usePathname()

  function handleClick() {
    // setLoading(true);
  }

  const {
    companyNameText = 'Company name',
    currentlyWorkHere = 'I currently work here',
    from = 'From',
    placeholder = 'Text'
  } = lang?.profile || {}
  useEffect(() => {
    if (resume) {
      if (maxFileSize(resume, 5)) {
        setErrorMessage('')
        console.log(resume,777)
        const payload = {
          resume,
          id
        }
        uploadUserResumeServiceNew(payload).then(res=>{
           console.log(res.data)
        })

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
  const handleDelete = (index) => {
    selectedSkills.splice(index,1)
    setSelectedSkills([...selectedSkills])
    console.info('You clicked the delete icon.');
  };

  const backClick = () => {
    router.push(`${pathname}?step=3`)
  }

 const addSecected = (item) => {
  setSelectedSkills([...selectedSkills,item])
 }

  return (
    <div className={styles.work}>
      <Header />
      <div className={styles.workContainer}>
        <Stepper step={0}/>
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
              Working period <span>*</span>
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
                  label={from}
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
            Most recent job title and  Skills <span>*</span>
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
                onChangeSkill={(value) =>  setSkills(value)}
              />
            </div>

            <p className={styles.titleTip}>
            Skills will be suggested based on selected job function. Please select max 5 skills.
            </p>
            <div className={styles.skillList}>
              {
               differenceBy(skills,selectedSkills,'id').map(e=><span key={e.id}  onClick={()=>addSecected(e)}>{e.value}</span>)
              }
            </div>
             <div className={styles.chooseSkill}>
              <p >Select skills or type your own skills</p>
               {
                selectedSkills.map((item,index)=> <Chip key={item.id} sx={{
                  background:"#136FD3",
                  margin:'8px  8px 0 0'
                }} color="primary" label={item.value} onDelete={()=>handleDelete(index)} />)
               }
              
             </div>

             <p className={`${styles.title} ${styles.titlePeriod}`}>
             Description
            </p>

            <div className={styles.step3Editor}>
              <TextEditor value={description} setValue={setDescription} placeholder={placeholder} />
            </div>




          </div>
        </div>

        <FootBtn
          loading={loading}
          rightText={'Next (2/4)'}
          backClick={backClick}
          // handleClick={handleSubmit(handleUpdateProfile)}
        />



      </div>
   
    </div>
  )
}

export default WorkExperience
