import React, { useState, useEffect ,useContext} from 'react'
import styles from '../index.module.scss'
import Stepper from './stepper'
import MaterialTextField from 'components/MaterialTextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Text from 'components/Text'
import MaterialDatePicker from 'components/MaterialDatePicker'
import { addUserEducationService } from 'store/services/users/addUserEducation'
import { updateUserEducationService } from 'store/services/users/updateUserEducation'
import { usePathname } from 'next/navigation'
import FootBtn from './footBtn'
import moment from 'moment'
import { removeEmptyOrNullValues } from 'helpers/formatter'
import { LinkContext } from 'app/[lang]/components/providers/linkProvider'
const EducationExperience = (props: any) => {
  console.log(props)
  const {
    config: { degrees },
    lang,
    userDetail,
    getUserInfo
  } = props
  const {educations} = userDetail
  const { push } = useContext(LinkContext)
  const [selectedDegrees, setSelectedDegrees] = useState<number>(null)
  const [school, setSchool] = useState('')
  const [fieldStudy, setFieldStudy] = useState('')
  const [isCurrentStudying, setIsCurrentStudying] = useState(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [studyPeriodFrom, setStudyPeriodFrom] = useState(null)
  const [studyPeriodTo, setStudyPeriodTo] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if(userDetail.educations?.length ){
      const { 
        degree_id,
        is_currently_studying,
        school,
        field_of_study,
        study_period_from,
        study_period_to,     
      } =  userDetail.educations[0]
      setSelectedDegrees(degree_id || 7)
      setIsCurrentStudying(is_currently_studying)
      setSchool(school)
      setFieldStudy(field_of_study)
      setStudyPeriodFrom(study_period_from)
      setStudyPeriodTo(study_period_to)
    }
  },[JSON.stringify(userDetail)])

  const pathname = usePathname()
  const {
    schoolName,
    fieldOfStudy,
    currentlyAttending,
    from,
    to,
    educationExperience,
    educationLevel,
    fillThisLater,
    Next3,
    back,
    studyPeriod
  } = lang?.profile || {}
console.log({userDetail})
 useEffect(()=>{
   if(selectedDegrees && school && fieldStudy  && studyPeriodFrom  && (!isCurrentStudying  ? studyPeriodTo :true ) ){
    setIsDisabled(false)
   }else{
    setIsDisabled(true)
   }
 },[selectedDegrees,school,fieldStudy,studyPeriodFrom,studyPeriodTo,isCurrentStudying])



  const handleSubmit = () => {
    const educationData = {
      school: school,
      is_currently_studying: isCurrentStudying,
      study_period_from: moment(new Date(studyPeriodFrom)).format('yyyy-MM-DD'),
      study_period_to: isCurrentStudying  ? null : moment(new Date(studyPeriodTo)).format('yyyy-MM-DD'),
      field_of_study: fieldStudy,
      degree_id: selectedDegrees
    }
    setLoading(true)
   if(educations?.length){
    const id = educations[0].id
    const educationPayload= {
      educationId:id,
      educationData:removeEmptyOrNullValues(educationData)
     }
     updateUserEducationService(educationPayload).then(res=>{
      if(res.data){
        getUserInfo?.()
        push(`${pathname}?step=4`)
      }
     }).finally(()=>setLoading(false))
   }else{
    const educationPayload= {
      educationData:removeEmptyOrNullValues(educationData)
     }
     addUserEducationService(educationPayload).then(res=>{
      if(res.data){
        getUserInfo?.()
        push(`${pathname}?step=4`)
      }
     }).finally(()=>setLoading(false))
   }
  }

  const backClick = () => {
    const  isExperienced =  sessionStorage.getItem('isExperienced')
    push(`${pathname}?step=${isExperienced ? 1 : 2}`)
  }

  return (
    <div className={styles.work}>
      <div className={styles.workContainer}>
        <Stepper step={1} lang={lang}/>
        <div className={styles.box}>
          <div className={styles.headerInfo}>{educationExperience}</div>
          <div className={styles.body}>
            <p className={styles.title}>{educationLevel}</p>
            <div className={styles.btnList}>
              {degrees
                .filter((e) => e.id !== 5)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDegrees(item.id)}
                    className={`${item.id === selectedDegrees ? styles.active : ''}`}
                  >
                    {item.value}
                  </button>
                ))}
            </div>

            <p className={styles.title}>{schoolName}</p>
            <div className={styles.stepField}>
              <MaterialTextField
                className={styles.stepFullwidth}
                label={schoolName}
                size='small'
                value={school}
                defaultValue={school}
                onChange={(e) => setSchool(e.target.value)}
              />
            </div>

            <p className={styles.title}>{fieldOfStudy}</p>
            <div className={styles.stepField}>
              <MaterialTextField
                className={styles.stepFullwidth}
                label={fieldOfStudy}
                size='small'
                value={fieldStudy}
                defaultValue={fieldStudy}
                onChange={(e) => setFieldStudy(e.target.value)}
              />
            </div>

            <p className={`${styles.title} ${styles.titlePeriod}`}>{studyPeriod}</p>
            <div className={styles.stepFieldBody}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isCurrentStudying}
                    onChange={() => setIsCurrentStudying(!isCurrentStudying)}
                    name='currentStudent'
                  />
                }
                label={<Text textStyle='base'>{currentlyAttending}</Text>}
              />
              <div className={styles.stepFieldDate}>
                <div className={styles.stepFieldDateItem}>
                  <MaterialDatePicker
                    label={from}
                    views={['year', 'month']}
                    inputFormat='MMM yyyy'
                    value={studyPeriodFrom}
                    onDateChange={(value) => {
                      setStudyPeriodFrom(value)
                    }}
                  />
                </div>
                {!isCurrentStudying && (
                  <div className={styles.stepFieldDateItem}>
                    <MaterialDatePicker
                      label={to}
                      views={['year', 'month']}
                      inputFormat='MMM yyyy'
                      value={studyPeriodTo}
                      onDateChange={(value) => {
                        setStudyPeriodTo(value)
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <p className={`${styles.fillLater}`} onClick={()=>push(`${pathname}?step=4`)}>{fillThisLater}</p>
          </div>
        </div>

        <FootBtn
          loading={loading}
          rightText={Next3}
          backText={back}
          backClick={backClick}
          disabled={isDisabled}
          handleClick={handleSubmit}
        />
      </div>
    </div>
  )
}

export default EducationExperience
