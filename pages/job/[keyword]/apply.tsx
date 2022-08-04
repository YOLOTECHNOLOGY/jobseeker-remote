import React, { useState } from 'react'
import { useRouter } from 'next/router'

// @ts-ignore
import { END } from 'redux-saga'

/* Vendors */
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

/* Components */
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from '@mui/material/Chip';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import { Alert } from '@mui/material'
import MaterialDesktopTooltip from 'components/MaterialDesktopTooltip'
import MaterialMobileTooltip from 'components/MaterialMobileTooltip'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import Layout from 'components/Layout'
import Text from 'components/Text'
import UploadResume from 'components/UploadResume'

/* Helpers */
import useWindowDimensions from 'helpers/useWindowDimensions'

/* Action Creators */
import { wrapper } from 'store'

/* Redux Actions */
import { applyJobRequest } from 'store/actions/jobs/applyJob'
import { fetchJobDetailRequest } from 'store/actions/jobs/fetchJobDetail'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { uploadUserResumeService } from 'store/services/users/uploadUserResume'

/* Styles */
import styles from './ApplyJob.module.scss'

/* Images */
import {
  DisclaimerIcon,
  MobileIcon,
  MailIcon,
  ProfileIcon
} from 'images'
interface IApplyJobDetail {
  jobDetail: any
  userDetail: any
}

const Job = ({
  jobDetail,
  userDetail,
}: IApplyJobDetail) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { width } = useWindowDimensions()
  const isMobile = width < 768 ? true : false
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm()

  const [resume, setResume] = useState(userDetail?.resume || null)
  const [matchedSkills, setMatchedSkills] = useState(jobDetail?.skills || [])
  const [firstMessage, setFirstMessage] = useState(`Hi there, I am interested to apply for the ${jobDetail?.job_title} position.`)
  const screeningQuestions = jobDetail?.screening_questions || []
  const [isSubmitting, setIsSubmitting] = useState(false)

  const errorText = (errorMessage: string) => {
    return <Text textStyle='sm' textColor='red' tagName='p' className={styles.error}>{errorMessage}</Text>
  }

  const handleSkillClick = (key) => {
    const newMatchedSkills = [...matchedSkills]
    newMatchedSkills[key].is_qualified = !newMatchedSkills[key].is_qualified

    setMatchedSkills(newMatchedSkills)
  };

  const onError = () => {
    if (!resume) {
      setError('resume', { type: 'custom', message: 'Please upload your resume' })
    }
  }

  const onSubmit = (data) => {
    const screeningAnswers = []

    screeningQuestions.forEach((element, index) => {
      screeningAnswers.push(data[`screening_answer_${index}`])
    })

    const userSkills = matchedSkills.filter((skill) => {
      return skill.is_qualified
    }).map(skill => skill.value).join(',')

    const payload = {
      screeningAnswers: screeningAnswers,
      firstMessage: firstMessage,
      jobId: jobDetail.id,
      jobUrl: jobDetail.job_url,
      source: isMobile ? 'mobile_web' : 'web',
      userSkills
    }

    clearErrors()
    setIsSubmitting(true)

    dispatch(applyJobRequest(payload))
  }

  const handleDeleteResume = () => {
    setResume(null)
  }

  const handleUploadResume = (file) => {
    uploadUserResumeService(file)
    .then((response) => {
      setResume(response.data.data)
      clearErrors('resume')
    })
    .catch(error => {
      dispatch(displayNotification({
        open: true,
        severity: 'error',
        message: `Failed to upload resume with error: ${error.message}. 
        Please contact support@bossjob.com for assistance.`
      }))
    })
  }

  return (
    <Layout>
      <div className={styles.jobDetail}>
        <div className={styles.jobDetailSection}>
          <Text textStyle='xl' tagName='h1' bold>
            Apply to 
              <Text textColor='primaryBlue' bold> {jobDetail?.company?.name} </Text>
              as a <Text textColor='primaryBlue' bold> {jobDetail?.job_title}</Text>
          </Text>
        </div>

        <div className={styles.jobDetailSection}>
          <div className={styles.jobDetailSectionTitle}>
            <Text textStyle='xl' bold>
              Contact Information
              {isMobile ? (
                <MaterialMobileTooltip
                  icon={DisclaimerIcon}
                  className={styles.disclaimerIcon}
                  title='Recruiter will contact you if you are shortlisted for an interview.'
                />
                ) : (
                <MaterialDesktopTooltip
                  icon={DisclaimerIcon}
                  className={styles.disclaimerIcon}
                  title='Recruiter will contact you if you are shortlisted for an interview.'
                />
                )
              }
            </Text>
          </div>

          <div className={styles.jobDetailSectionBox}>
            <div className={styles.contactInfo}>
              <div>
                <img src={ProfileIcon} height='14' width='14' /> 
                <Text>
                {userDetail.first_name} {userDetail.last_name}
                </Text>
              </div>
              <div>
                <img src={MailIcon} height='14' width='14' /> 
                <Text>
                  {userDetail.email}
                </Text>
              </div>
              <div>
                <img src={MobileIcon} height='14' width='14' /> 
                <Text>
                  {userDetail.phone_num}
                </Text>
              </div>
            </div>
          </div>
          
          <div className={styles.jobDetailSection}>
            <Accordion 
              disableGutters={true} 
              className={styles.skillMatchAccordion}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
              >
                <Text textStyle='xl' bold>
                  Your match with the job skills
                </Text>
              </AccordionSummary>
              <AccordionDetails className={styles.skillMatchAccordionDetails}>
                <Text>
                  Add the skill if you have them. It is not necessary to have all the skills, but having rare skill make you unique and outstanding.
                </Text>
                <div className={styles.skillMatch}>
                  {matchedSkills.length > 0 &&
                    matchedSkills?.map((skill, i) => {
                      return (
                        <Chip
                          className={styles.skillChip}
                          key={i}
                          label={skill.value}
                          variant={skill.is_qualified ? 'filled' : 'outlined'}
                          color='success'
                          size='small' 
                          onClick={() => {
                            handleSkillClick(i)
                          }}
                          icon={skill.is_qualified ? <DoneIcon /> : <AddIcon />} 
                        />
                      )
                  })}
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>

        <div className={styles.jobDetailSection}>
          <div className={styles.jobDetailSectionTitle}>
            <Text textStyle='xl' bold>
              Resume <span style={{ color: 'red'}}>*</span>
            </Text>
          </div>
          <div className={styles.jobDetailSectionBox}>
            <UploadResume
              title='resume'
              resume={resume}
              handleDelete={handleDeleteResume}
              handleUpload={handleUploadResume}
            />
          </div>

          {errors.resume && errorText(errors.resume.message)}
        </div>

        <div className={styles.jobDetailSection}>
          <div className={styles.jobDetailSectionTitle}>
            <Text textStyle='xl' bold>
              Question from recruiter <span style={{ color: 'red'}}>*</span>
            </Text>
          </div>

          <div className={styles.jobDetailSectionScreeningQuestion}>
            {screeningQuestions.length === 0 && (
              <div className={styles.info}>
                <div className={styles.question}>
                  <Text>
                    On Bossjob, you can message with the recruiter in real-time. Impress the recruiter
                    by sending a message first. (Tips: the reason why you are the perfect fit for this
                    job)
                  </Text>
                </div>
                <div className={styles.answer}>
                  <MaterialTextField
                    refs={{
                      ...register('firstMessage', {
                        required: {
                          value: true,
                          message: 'Please enter a valid answer.',
                        },
                      }),
                    }}
                    label='Answer'
                    multiline
                    rows={4}
                    variant='outlined'
                    size='small'
                    value={firstMessage}
                    onChange={(e) => {
                      setFirstMessage(e.target.value)
                    }}
                  />
                </div>

                {errors.firstMessage && errorText(errors.firstMessage.message)}
              </div>
            )}

            {screeningQuestions.length > 0 &&
              jobDetail?.screening_questions.map((question, i) => {
                return (
                  <div key={i} className={styles.info}>
                    <div className={styles.question}>
                      <Text textStyle='lg'>
                        {i + 1}. {question}
                      </Text>
                    </div>
                    <div className={styles.answer}>
                      <MaterialTextField
                        refs={{
                          ...register(`screening_answer_${i}`, {
                            required: {
                              value: true,
                              message: 'Please enter a valid answer.',
                            },
                          }),
                        }}
                        label='Provide your answer here'
                        multiline
                        rows={5}
                        variant='outlined'
                        size='small'
                      />

                      {errors[`screening_answer_${i}`] &&
                        errorText(errors[`screening_answer_${i}`].message)}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        <div className={styles.jobDetailSection}>
          <div className={styles.jobDetailSectionBewareMessage}>
            <Alert sx={{ width: '100%' }} severity='info'>
              Beware of recruitment scams! Do not make any upfront payment or share your financial details with recruiter. If you find any suspicious job ads or recruiters on Bossjob, please report to our support team immediately.
            </Alert>
          </div>
        </div>
      </div>

      <div className={styles.jobDetailSectionFooter}>
        <div className={styles.jobDetailSectionFooterContainer}>
          <div className={styles.jobDetailSectionAction}>
            <MaterialButton 
              variant='outlined' 
              capitalize 
              onClick={() => {
                router.push(jobDetail.job_url)
              }}
            >
              <Text textColor='primaryBlue' bold>Cancel</Text>
            </MaterialButton>
            <MaterialButton 
              variant='contained' 
              isLoading={isSubmitting} 
              capitalize 
              onClick={handleSubmit(onSubmit, onError)}
            >
              <Text textColor='white' bold>Submit</Text>
            </MaterialButton>
          </div>
        </div>
      </div>
      
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query, req }) => {
  const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null
  const { keyword } = query
  const keywordQuery: any = keyword
  const jobId = keywordQuery?.split('-').pop()
  
  store.dispatch(fetchJobDetailRequest({
      jobId,
      status: 'protected',
      serverAccessToken: accessToken,
    })
  )
  store.dispatch(fetchUserOwnDetailRequest({accessToken}))
  store.dispatch(END)
  
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const jobDetail = storeState.job?.jobDetail.response
  const userDetail = storeState.users?.fetchUserOwnDetail.response
  
  // Redirect to job page if the job has been applied by the user
  if (jobDetail.is_applied) {
    return {
      redirect: {
        permanent: false,
        destination: jobDetail.job_url
      }
    }
  }

  return {
    props: {
      jobDetail: jobDetail,
      userDetail: userDetail,
    }
  }
})

export default Job
