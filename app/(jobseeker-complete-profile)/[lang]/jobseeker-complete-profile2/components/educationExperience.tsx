import React, { useState, useEffect } from 'react'
import styles from '../index.module.scss'
import Header from './Header'
import Stepper from './stepper'
import LoadingButton from '@mui/lab/LoadingButton'
import MaterialTextField from 'components/MaterialTextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Text from 'components/Text'
import MaterialDatePicker from 'components/MaterialDatePicker'
const EducationExperience = (props: any) => {
  console.log(props)
  const {
    config: { degrees },
    lang
  } = props

  const [selectedDegrees, setSelectedDegrees] = useState<number>(7)
  const [school, setSchool] = useState('')
  const [fieldStudy, setFieldStudy] = useState('')
  const [isCurrentStudying, setIsCurrentStudying] = useState(false)

  const [studyPeriodFrom, setStudyPeriodFrom] = useState(null)
  const [studyPeriodTo, setStudyPeriodTo] = useState(null)

  const [loading, setLoading] = useState(false)
  function handleClick() {
    // setLoading(true);
  }
  const {
    schoolName = "schoolName",
    fieldOfStudy = "field Of Study",
    currentlyWorkHere="Currently attending ",
    from = 'From',
    to="To"
  } = lang?.profile || {}

  const requiredLabel = (text: string) => {
    return (
      <>
        <span>{text}</span>
        <span className={styles.stepFieldRequired}>*</span>
      </>
    )
  }

  return (
    <div className={styles.work}>
      <Header />
      <div className={styles.workContainer}>
        <Stepper step={2} />
        <div className={styles.box}>
          <div className={styles.headerInfo}>Education Experience</div>
          <div className={styles.body}>
            <p className={styles.title}>Education level</p>
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


            <p className={styles.title}>School name</p>
            <div className={styles.stepField}>
            <MaterialTextField
              className={styles.stepFullwidth}
              label={requiredLabel(schoolName)}
              size='small'
              value={school}
              defaultValue={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </div>

          <p className={styles.title}>Field of study</p>
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

          <p className={`${styles.title} ${styles.titlePeriod}`}>Study period</p>
          <div className={styles.stepFieldBody}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isCurrentStudying}
                    onChange={() => setIsCurrentStudying(!isCurrentStudying)}
                    name='currentStudent'
                  />
                }
                label={<Text textStyle='base'>{currentlyWorkHere}</Text>}
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

            </div>
            </div>

            <p className={`${styles.fillLater}`}>Fill this later</p> 
          </div>
        </div>
        <div className={styles.next}>
          <LoadingButton
            onClick={handleClick}
            loading={loading}
            variant='contained'
            sx={{
              width: '202px',
              height: '44px',
              textTransform: 'capitalize',
              background: '#F0F0F0',
              color: '#707070',
              boxShadow: 'none',
              borderRadius: '10px'
            }}
          >
            <span>Next (1/4)</span>
          </LoadingButton>
          <LoadingButton
            onClick={handleClick}
            loading={loading}
            variant='contained'
            sx={{
              width: '202px',
              height: '44px',
              textTransform: 'capitalize',
              border: '1px solid #136FD3',
              background: 'transparent',
              color: '#136FD3',
              boxShadow: 'none',
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

export default EducationExperience
