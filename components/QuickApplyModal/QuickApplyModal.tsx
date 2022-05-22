import React, { useState, useEffect } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

/* Components */
import Modal from 'components/Modal'
import Text from 'components/Text'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import Link from 'components/Link'
import FormControlLabel from '@mui/material/FormControlLabel'

/* Styles */
import styles from './QuickApplyModal.module.scss'

/* Redux Actions */
import { quickApplyJobRequest } from 'store/actions/jobs/quickApplyJob'

/* Helpers*/
import {
  getSmsCountryList,
} from 'helpers/jobPayloadFormatter'
import Checkbox from '@mui/material/Checkbox'

interface QuickApplyModalProps {
  jobDetails: any
  applyJobLink: String
  modalShow?: boolean
  handleModalShow?: Function
  config: any
}

const QuickApplyModal = ({ jobDetails, applyJobLink, modalShow, handleModalShow, config  }: QuickApplyModalProps) => {
  const dispatch = useDispatch()
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm()

  const smsCountryList = getSmsCountryList(config)
  const [smsCode, setSmsCode] = useState('+63')
  const [resume, setResume] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [firstMessage, setFirstMessage] = useState(`Hi there, I am interested to apply for ${jobDetails.job_title} for ${jobDetails.company?.name} position.`)
  const screeningQuestions = jobDetails?.screening_questions || []

  const registerJobseekerState = useSelector((store: any) => store.auth.registerJobseeker)
  const isQuickApplyJobFetching = useSelector((store: any) => store.job.quickApplyJob.fetching)

  useEffect(() => {
    if (registerJobseekerState.error && registerJobseekerState.error['email']) {
      if (registerJobseekerState.error['email'] == 'The email has already been taken.') {
        setError('email', { type: 'custom', message: 'A user with this email address already exists.' });
      } else {
        setError('email', { type: 'custom', message: registerJobseekerState.error['email'] });
      }

      setIsSubmitting(false)
    }
  }, [registerJobseekerState])

  useEffect(() => {
    setIsSubmitting(isQuickApplyJobFetching)
  }, [isQuickApplyJobFetching])
  
  const onSubmit = (data) => {
    const screeningAnswers = screeningQuestions.filter((question, i) => {
      return data[`screening_answer_${i}`]
    })

    const jobCategories = jobDetails.categories.map(function(category){
        return category .key;
    }).join('-')

    const payload = {
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      contact_number: smsCode + data.contactNumber,
      terms_and_condition: false,
      is_subscribe: isSubscribed,
      resume: resume,
      screening_answers: screeningAnswers,
      first_message: firstMessage,
      jobId: jobDetails.id,
      jobCategories: jobCategories,
      companyId: jobDetails.company?.id
    }

    clearErrors()
    setIsSubmitting(true)

    dispatch(quickApplyJobRequest(payload))
  }

  const errorText = (errorMessage: string) => {
    return <Text textStyle='sm' textColor='red' tagName='p' className={styles.error}>{errorMessage}</Text>
  }

  return (
    <Modal
      headerTitle='Apply to this job'
      showModal={modalShow}
      handleModal={() => handleModalShow(false)}
      className={styles.quickApplyModal}
    >
      <form className={styles.quickApplyForm} onSubmit={handleSubmit(onSubmit)}> 
        <div className={styles.quickApplyFormField}>
          <Text> Already on Bossjob?
            <Link aTag to={'/login/jobseeker?redirect=' + applyJobLink}>
              <Text textColor='primaryBlue' underline>
                {' '}
                Log in
              </Text>
            </Link>
          </Text>
        </div>

        <div className={`${styles.quickApplyFormField} ${styles.halfWidth}`}>
          <div className={styles.firstName}>
            <MaterialTextField
              refs={{
                ...register('firstName', {
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                }),
              }}
              label='First name'
              size='small'
              onChange={() => {
                clearErrors('firstName')
              }}
            />
            {errors.firstName && errorText(errors.firstName.message)}
          </div>
          
          <div className={styles.lastName}>
            <MaterialTextField
              refs={{
                ...register('lastName', {
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                }),
              }}
              label='Last name'
              size='small'
              onChange={() => {
                clearErrors('lastName')
              }}
            />
            {errors.lastName && errorText(errors.lastName.message)}
          </div>
        </div>
        
        <div className={styles.quickApplyFormField}>
          <MaterialTextField
            refs={{
              ...register('email', {
                required: {
                  value: true,
                  message: 'This field is required.',
                },
              }),
            }}
            label='Email address'
            type='email'
            size='small'
            onChange={() => {
              clearErrors('email')
            }}
          />
          {errors.email && errorText(errors.email.message)}
        </div>
        
        <div className={`${styles.quickApplyFormField} ${styles.halfWidth}`}>
          <div>
            <MaterialBasicSelect
              label='Country'
              value={smsCode}
              options={smsCountryList}
              onChange={(e) => {
                setSmsCode(e.target.value)
              }}
            />
          </div>
          
          <div>
            <MaterialTextField
              refs={{
                ...register('contactNumber', {
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                }),
              }}
              label='Contact number'
              type='number'
              size='small'
              onChange={() => {
                clearErrors('contactNumber')
              }}
            />
            {errors.contactNumber && errorText(errors.contactNumber.message)}
          </div>
        </div>
        
        <div className={styles.quickApplyFormField}>
          <MaterialTextField
            refs={{
              ...register('password', {
                required: {
                  value: true,
                  message: 'This field is required.',
                },
                minLength: {
                  value: 8,
                  message: 'Must be 8 characters or more.',
                },
                maxLength: {
                  value: 16,
                  message: 'Must be 16 characters or less.',
                },
              }),
            }}
            label='Password (minimum 8 characters)'
            type='password'
            size='small'
            onChange={() => {
              clearErrors('password')
            }}
          />
          {errors.password && errorText(errors.password.message)}
        </div>
        
        <div className={styles.quickApplyFormField}>
          <MaterialButton 
            variant='outlined' 
            capitalize 
            component="label"
          >
            <Text textStyle='base' textColor='primaryBlue' bold>Upload your resume</Text>
            <input 
              {...register('resume', {
                required: {
                  value: true,
                  message: 'This field is required.',
                },
              })}
              type="file" 
              hidden 
              accept=".pdf, .doc, .docx" 
              onChange={(e) => {
                clearErrors('resume')
                setResume(e.target.files[0])
              }}
            />
          </MaterialButton>
            
          {resume ?
          <Text textColor='darkgrey' textStyle='xsm'>
              Resume: {resume?.name}
          </Text> : 
          <Text textColor='darkgrey' textStyle='xsm'>
            Supported file type: PDF, DOC, DOCX. Max. file size: 5MB
          </Text>
          }

          {errors.resume && errorText(errors.resume.message)}
        </div>
        
        <div className={styles.quickApplyFormField}>
          {screeningQuestions.length > 0 && <Text textStyle='lg' bold>Questions from recruiter</Text>}

          {screeningQuestions .length > 0 &&
            screeningQuestions.map((question, i) => {
              return (
                <div key={i} className={styles.question}>
                  <Text textStyle='lg'>{i + 1}. {question}</Text>

                  <MaterialTextField
                    refs={{
                      ...register(`screening_answer_${i}`, {
                        required: {
                          value: true,
                          message: 'This field is required.',
                        },
                      })
                    }}
                    className={styles.answer}
                    label='Answer'
                    multiline
                    rows={4}
                    variant='outlined'
                    size='small'
                  />
                  {errors[`screening_answer_${i}`] && errorText(errors[`screening_answer_${i}`].message)}
                </div>
              )
            })}

            {screeningQuestions.length === 0 && 
              <div className={styles.question}>
                <Text textStyle='md'>On Bossjob, you can message with the recruiter in real-time. Impress the recruiter by sending a message first. (Tips: the reason why you are the perfect fit for this job)</Text>

                <MaterialTextField
                  refs={{
                    ...register('firstMessage', {
                      required: {
                        value: true,
                        message: 'This field is required.',
                      },
                    })
                  }}
                  className={styles.answer}
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
                {errors.firstMessage && errorText(errors.firstMessage.message)}
              </div>
            }
          </div>
        
        <div className={styles.quickApplyFormField}>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                value={isSubscribed}
                onChange={(e) => setIsSubscribed(e.target.checked)}
              />
            }
            label={
              <Text textStyle='sm'>
                Email me exclusive newsletters & job updates from Bossjob.
              </Text>
            }
          />
        </div>

        <MaterialButton
          capitalize
          size='large'
          variant='contained'
          type='submit'
          isLoading={isSubmitting} 
        >
          <Text textStyle='xl' textColor='white' bold>
            Register and apply
          </Text>
        </MaterialButton>
      </form>
    </Modal>
  )
}

export default QuickApplyModal