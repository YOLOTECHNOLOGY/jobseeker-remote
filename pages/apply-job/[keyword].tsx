import React, { useState } from 'react'
import { useRouter } from 'next/router'

// @ts-ignore
import { END } from 'redux-saga'

/* Vendors */
import { useDispatch } from 'react-redux'
import { useUserAgent } from 'next-useragent'
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
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import Layout from 'components/Layout'
import Text from 'components/Text'
import Link from 'components/Link'

/* Helpers */
import { maxFileSize } from 'helpers/handleInput'

/* Action Creators */
import { wrapper } from 'store'

/* Redux Actions */
import { applyJobRequest } from 'store/actions/jobs/applyJob'
import { fetchJobDetailRequest } from 'store/actions/jobs/fetchJobDetail'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { uploadUserResumeService } from 'store/services/users/uploadUserResume'

/* Styles */
import styles from './ApplyJob.module.scss'

/* Images */
import {
  DisclaimerIcon,
  TrashIcon,
  DocumentIcon
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

  const onSubmit = (data) => {
    const userAgent = useUserAgent(window && typeof window !== undefined && (window.navigator.userAgent)) || null
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
      source: userAgent?.isMobile ? 'mobile_web' : 'web',
      userSkills
    }

    clearErrors()
    setIsSubmitting(true)

    dispatch(applyJobRequest(payload))
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
              <MaterialDesktopTooltip
                icon={DisclaimerIcon}
                className={styles.disclaimerIcon}
                title='Recruiter will contact you if you are shortlisted for an interview.'
              />
            </Text>
          </div>

          <div className={styles.jobDetailSectionBox}>
            <div className={styles.contactInfo}>
              <div>
                <img src={DisclaimerIcon} height='14' width='14' /> 
                <Text>
                {userDetail.first_name} {userDetail.last_name}
                </Text>
              </div>
              <div>
                <img src={DisclaimerIcon} height='14' width='14' /> 
                <Text>
                  {userDetail.email}
                </Text>
              </div>
              <div>
                <img src={DisclaimerIcon} height='14' width='14' /> 
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
                  Add the skill if you have them. Having a low value may not be a bad thing, having rare skill make you unique and outstanding.
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
            {resume ? (
              <div className={styles.uploadedResume}>
                <div className={styles.leftResume}>
                  <div className={styles.documentDiv}>
                    <img src={DocumentIcon} alt='document' width='21' height='21' />
                  </div>
                  <Link to={resume?.url} external aTag>
                    <Text textStyle='sm' bold className={styles.resumeName}> {resume?.name}</Text>
                  </Link>
                </div>
                <div className={styles.trashDiv}>
                  <img
                    src={TrashIcon}
                    alt='trash'
                    width='14'
                    height='14'
                    onClick={() => {
                      clearErrors('resume')
                      setResume(null)
                    }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <MaterialButton variant='outlined' capitalize component='label'>
                  <Text textStyle='base' textColor='primaryBlue' bold>
                    Upload your resume
                  </Text>
                  <input
                    {...register('resume', {
                      required: {
                        value: true,
                        message: 'Please upload your resume.',
                      },
                    })}
                    type='file'
                    hidden
                    accept='.pdf, .doc, .docx'
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (!maxFileSize(file, 5)) {
                        setError('resume', {
                          type: 'custom',
                          message: 'File size is too huge. Please upload file that is within 5MB.',
                        })
                        return
                      }

                      // Call upload resume request on the fly
                      uploadUserResumeService(file).then(response => {
                        const data = response?.data?.data

                        clearErrors('resume')
                        setResume({
                          'name': data?.name,
                          'url': data?.url,
                        })
                      })
                    }}
                  />
                </MaterialButton>
              </div>
            )}
            <Text textColor='darkgrey' textStyle='xsm'>
              Supported file type: PDF, DOC, DOCX. Max. file size: 5MB
            </Text>
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
        
        <div className={styles.jobDetailSection}>
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
              onClick={handleSubmit(onSubmit)}
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
  store.dispatch(fetchConfigRequest())
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
