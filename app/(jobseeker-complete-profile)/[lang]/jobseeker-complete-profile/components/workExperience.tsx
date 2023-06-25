import React, { useState, useEffect, useContext, useRef } from 'react'
import styles from '../index.module.scss'
import Stepper from './stepper'
import LoadingButton from '@mui/lab/LoadingButton'
import Text from 'components/Text'
import { maxFileSize } from 'helpers/handleInput'
import MaterialDatePicker from 'components/MaterialDatePicker'
import JobFunctionSelector from 'components/JobFunctionSelector'
import FormControlLabel from '@mui/material/FormControlLabel'
import MaterialTextField from 'components/MaterialTextField'
import Switch from '@mui/material/Switch'
import Chip from '@mui/material/Chip'
import TextEditor from 'components/TextEditor/TextEditor'
import FootBtn from './footBtn'
import { usePathname } from 'next/navigation'
import { uploadUserResumeService } from 'store/services/users/uploadUserResume'
import { differenceBy} from 'lodash-es'
import { updateUserCompleteProfileService } from 'store/services/users/updateUserCompleteProfile'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { addUserWorkExperienceService } from 'store/services/users/addUserWorkExperience'
import { updateUserWorkExperienceService } from 'store/services/users/updateUserWorkExperience'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { fetchResumes } from 'store/services/jobs/fetchJobsCommunicated'
import Link from 'components/Link'
import { LinkContext } from 'app/[lang]/components/providers/linkProvider'


const WorkExperience = (props: any) => {
  const { lang, userDetail, getUserInfo } = props
  const { work_experiences } = userDetail
  const [resume, setResume] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [jobFunction, setJobFunction] = useState<any>({ id: undefined, value: '' })
  const [companyName, setCompanyName] = useState<string>('')
  const [isCurrentJob, setIsCurrentJob] = useState<boolean>(true)
  const [workingSince, setWorkingSince] = useState<any>(null)
  const [workPeriodFrom, setWorkPeriodFrom] = useState<any>(null)
  const [workPeriodTo, setWorkPeriodTo] = useState<any>(null)
  const [description, setDescription] = useState<string>('')
  const [skills, setSkills] = useState<any>([])
  const [selectedSkills, setSelectedSkills] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [existingResume, setExistingResume] = useState<any>([])
  const [resumeDisable, setResumeDisable] = useState<boolean>(false)
  const [resumeLoading, setResumeLoading] = useState<boolean>(false)
  const dataSkills = userDetail?.skills
  const dispatch = useDispatch()
  const { push } = useContext(LinkContext)
  const inputNode = useRef(null)
  const tags = []
  const pathname = usePathname()

  useEffect(() => {
    getResumes()
  }, [])

  const getResumes = () => {
    fetchResumes().then((res) => {
      setExistingResume(res?.data?.data || [])
    })
  }

  useEffect(() => {
    if (existingResume?.length >= 3) {
      setResumeDisable(true)
    } else {
      setResumeDisable(false)
    }
  }, [existingResume])

  useEffect(() => {
    if (dataSkills?.length && skills?.length) {
      const arr = []
      dataSkills.map(e=>{
        const findItem = skills.find(k=>String(k.id) === e)  
         if(findItem){
          arr.push(findItem)
         }else{
          arr.push({
            id:e,
            value:e
          })
         }
      })
      setSelectedSkills(arr)
    }
  }, [dataSkills, skills])

  useEffect(() => {
    if (userDetail.working_since) {
      const { working_since } = userDetail
      setWorkingSince(working_since)
    }
    if (userDetail.work_experiences?.length) {
      const {
        company,
        description,
        function_job_title,
        function_job_title_id,
        working_period_from,
        working_period_to,
        is_currently_work_here
      } = userDetail.work_experiences[0]
      setCompanyName(company)
      setJobFunction({ id: function_job_title_id, value: function_job_title })
      setIsCurrentJob(is_currently_work_here)
      setWorkPeriodFrom(working_period_from)
      setWorkPeriodTo(working_period_to)
      setDescription(description)
    }
  }, [JSON.stringify(userDetail)])

  useEffect(() => {
    if (companyName && workPeriodFrom && (!isCurrentJob ? workPeriodTo : true) && jobFunction?.id) {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }, [jobFunction, companyName, isCurrentJob, workPeriodFrom, workPeriodTo])

  const {
    workExperience,
    autofillMyInfo,
    saveTimeByImporting,
    uploadResume,
    supportedFileType,
    startedWorkingSince,
    mostRecentCompany,
    WorkingPeriod,
    mostRecentJobTitle,
    skillsWillBeSuggested,
    selectSkillsOr,
    Next2,
    back,
    companyNameText,
    currentlyWorkHere,
    from,
    to,
    placeholder,
    skip
  } = lang?.profile || {}
  useEffect(() => {
    if (resume) {
      if (maxFileSize(resume, 5)) {
        setErrorMessage('')
        setResumeLoading(true)
        uploadUserResumeService(resume).then((res) => {
          getResumes()
          if (res.data) {
            setResumeLoading(false)
            dispatch(
              displayNotification({
                open: true,
                message: 'uplod seccess',
                severity: 'success'
              })
            )
          }
        })
      } else {
        setErrorMessage(lang?.profile?.fileTooHuge)
      }
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
  const handleDelete = (e,index) => {
    e.preventDefault()
    selectedSkills.splice(index, 1)
    setSelectedSkills([...selectedSkills])
  }

  const backClick = () => {
    push(`${pathname}?step=1`)
  }
   console.log({selectedSkills})
  const handleSubmit = () => {
    const paramsProfile = {
      working_since: moment(new Date(workingSince)).format('yyyy-MM-DD'),
      skills: selectedSkills.map((e) => e.id)?.join(',')
    }

    const p1 = updateUserCompleteProfileService(paramsProfile)
    setLoading(true)
    let p2 = null
    const paramsWork = {
      job_title: jobFunction?.value,
      function_job_title_id: jobFunction?.id,
      company: companyName,
      working_period_from: moment(new Date(workPeriodFrom)).format('yyyy-MM-DD'),
      working_period_to: isCurrentJob ? null : moment(new Date(workPeriodTo)).format('yyyy-MM-DD'),
      is_currently_work_here: isCurrentJob,
      description
    }
    if (isCurrentJob) {
      delete paramsWork.working_period_to
    }
    if (work_experiences?.length) {
      const data = work_experiences[0]
      const paramsUpdate = {
        workExperienceId: data.id,
        workExperienceData: paramsWork
      }
      p2 = updateUserWorkExperienceService(paramsUpdate)
    } else {
      p2 = addUserWorkExperienceService({
        workExperience: paramsWork
      })
    }

    Promise.all([p1, p2])
      .then(() => {
        getUserInfo?.()
        push(`${pathname}?step=3`)
      })
      .finally(() => setLoading(false))
  }

  const addSecected = (item) => {
    if (selectedSkills?.length >= 5) return
    setSelectedSkills([...selectedSkills, item])
  }

  const handleKeyUp = (e) => {
    const val = e.target.value
    const formattedVal = val.substring(0, val.length - 1).trim()

    if (
      val &&
      (e.key === 'Enter' || e.keyCode == 13) &&
      !tags.find((tag) => tag.toLowerCase() === val.toLowerCase())
    ) {
      setSelectedSkills([...selectedSkills, { id: val, value: val }])
      inputNode.current.value = null
    } else if (
      formattedVal &&
      (e.key === ',' || e.keyCode == 188) &&
      !tags.find((tag) => tag.toLowerCase() === formattedVal.toLowerCase())
    ) {
      setSelectedSkills([...selectedSkills, { id: formattedVal, value: formattedVal }])
      inputNode.current.value = null
    }
  }

  const handleKeyDown = (e) => {
    const val = e.target.value
    if (e.key === 'Backspace' && !val) {
      removeTag(tags.length - 1)
    }
  }

  const removeTag = (index) => {
    const newTags = [...selectedSkills]
    newTags.splice(index, 1)
    setSelectedSkills(newTags)
    // input.onChange(newTags)
  }

  return (
    <div className={styles.work}>
      <div className={styles.workContainer}>
        <Stepper step={0} lang={lang} />
        <div className={styles.box}>
          <div className={styles.headerInfo}>{workExperience}</div>
          <div className={styles.body}>
            <p className={styles.title}>{autofillMyInfo}</p>
            <p className={styles.titleTip}>{saveTimeByImporting}</p>
            <div className={styles.upload}>
              <LoadingButton
                loading={resumeLoading}
                variant='contained'
                component='label'
                disabled={resumeDisable}
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
                  {uploadResume}
                </Text>
                <input
                  type='file'
                  hidden
                  accept='.pdf, .doc, .docx'
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </LoadingButton>
            </div>

            {existingResume?.length
              ? existingResume.map((e) => (
                  <div key={e.id} className={styles.resumeList}>
                    <Link
                      to={e.url}
                      target='_blank'
                      rel='noreferrer'
                      style={{ textDecoration: 'underline' }}
                    >
                      {e.filename || e.name}
                    </Link>
                  </div>
                ))
              : null}
            <p className={styles.titleTip}>{supportedFileType}</p>
            <p className={styles.title}>
              {startedWorkingSince} <span>*</span>
            </p>
            <div className={styles.stepFieldDateItem}>
              <MaterialDatePicker
                label={'Month year'}
                views={['year', 'month']}
                inputFormat='MMM yyyy'
                value={workingSince}
                fullWidth
                onDateChange={(value) => {
                  setWorkingSince(value)
                }}
              />
            </div>
            <p className={styles.title}>
              {mostRecentCompany}
              <span>*</span>
            </p>
            <div className={styles.stepCompany}>
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
              {WorkingPeriod} <span>*</span>
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
                  value={workPeriodFrom}
                  onDateChange={(value) => {
                    setWorkPeriodFrom(value)
                  }}
                />
              </div>
              {!isCurrentJob && (
                <div className={styles.stepFieldToItem}>
                  <MaterialDatePicker
                    label={to}
                    views={['year', 'month']}
                    inputFormat='MMM yyyy'
                    value={workPeriodTo}
                    onDateChange={(value) => {
                      setWorkPeriodTo(value)
                    }}
                  />
                </div>
              )}
            </div>

            <p className={`${styles.title} ${styles.titlePeriod}`}>
              {mostRecentJobTitle} <span>*</span>
            </p>
            <div id='jobFunction' className={styles.stepJobFunction}>
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
                onChangeSkill={(value) => setSkills(value)}
              />
            </div>

            <p className={styles.titleTip}>{skillsWillBeSuggested}</p>
            <div className={styles.skillList}>
              {differenceBy(skills, selectedSkills, 'id').map((e) => (
                <span key={e.id} onClick={() => addSecected(e)}>
                  {e.value}
                </span>
              ))}
            </div>
            <div className={styles.chooseSkill}>
              <label htmlFor={'job_skills'} className={styles.labelBox}>
                <p>{selectSkillsOr}</p>
                <div className={styles.inputTag}>
                  <div className={styles.inputSkills}>
                    {selectedSkills.map((item, index) => (
                      <Chip
                        key={item.id}
                        sx={{
                          background: '#136FD3',
                          margin: '8px  8px 0 0'
                        }}
                        color='primary'
                        label={item.value}
                        onDelete={(e) => handleDelete(e,index)}
                      />
                    ))}
                  </div>
                  <input
                    id={'job_skills'}
                    name={'job_skills'}
                    ref={inputNode}
                    type='text'
                    disabled={selectedSkills?.length >=5 }
                    onKeyUp={handleKeyUp}
                    onKeyDown={handleKeyDown}
                    autoComplete='off'
                  />
                </div>
              </label>
            </div>

            <p className={`${styles.title} ${styles.titlePeriod}`}>{lang?.profile?.description}</p>

            <div className={styles.step3Editor}>
              <TextEditor value={description} setValue={setDescription} placeholder={placeholder} />
            </div>
          </div>
        </div>

        <FootBtn
          loading={loading}
          rightText={Next2}
          backClick={backClick}
          backText={back}
          skip={skip}
          disabled={isDisabled}
          skipText = {skip}
          handleClick={handleSubmit}
        />
      </div>
    </div>
  )
}

export default WorkExperience
