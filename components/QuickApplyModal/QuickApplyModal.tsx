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

/* Images */
import {
  TrashIcon,
  DocumentIcon
} from 'images'

/* Helpers*/
import {
  getSmsCountryList,
} from 'helpers/jobPayloadFormatter'
import Checkbox from '@mui/material/Checkbox'
import { maxFileSize, handleNumericInput } from 'helpers/handleInput'

interface QuickApplyModalProps {
  jobDetails: any
  applyJobLink: String
  modalShow?: boolean
  handleModalShow?: Function
  config: any
}

const QuickApplyModal = ({ jobDetails, applyJobLink, modalShow, handleModalShow, config }: QuickApplyModalProps) => {
  const dispatch = useDispatch()
  const { register, handleSubmit, setValue, setError, clearErrors, formState: { errors } } = useForm()

  const smsCountryList = getSmsCountryList(config)
  const [smsCode, setSmsCode] = useState('+63')
  const [resume, setResume] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailError, setEmailError] = useState(null)
  const [firstMessage, setFirstMessage] = useState('')
  const screeningQuestions = jobDetails?.screening_questions || []

  const registerJobseekerState = useSelector((store: any) => store.auth.registerJobseeker)
  const isQuickApplyJobFetching = useSelector((store: any) => store.job.quickApplyJob.fetching)

  useEffect(() => {
    setFirstMessage(`Hi there, I am interested to apply for ${jobDetails?.job_title} position.`)
  }, [jobDetails])
  
  useEffect(() => {
    if (registerJobseekerState.error && registerJobseekerState.error['email']) {
      if (registerJobseekerState.error['email'] == 'The email has already been taken.') {
        setEmailError(<p>A user with this email address already exists. Please enter a different email address or <a href={`/login/jobseeker?redirect=${applyJobLink}`} style={{ color: '#2379ea', textDecoration: 'underline' }}>log in</a>.</p>)
      } else {
        setError('email', { type: 'custom', message: registerJobseekerState.error['email'] })
      }
    }

    setIsSubmitting(registerJobseekerState.fetching)
  }, [registerJobseekerState])

  useEffect(() => {
    setIsSubmitting(isQuickApplyJobFetching)
  }, [isQuickApplyJobFetching])

  const onSubmit = (data) => {
    const screeningAnswers = []

    screeningQuestions.forEach((element, index) => {
      screeningAnswers.push(data[`screening_answer_${index}`])
    });

    const jobCategories = jobDetails.categories.map(function(category){
        return category.key;
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
      handleModal={handleModalShow}
      className={styles.quickApplyModal}
      closeModalOnOutsideClick={false} // TODO: temporary fix the select country code leads to modal close bug
      customFooter={
        <MaterialButton
          capitalize
          size='large'
          variant='contained'
          type='submit'
          isLoading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          className={styles.ctaButton}
        >
          <Text textColor='white' bold>
            Register and apply
          </Text>
        </MaterialButton>
      }
    >
      <form className={styles.quickApplyForm}>
        <div className={styles.quickApplyFormField}>
          <Text>
            {' '}
            Already on Bossjob?
            <Link to={'/login/jobseeker?redirect=' + applyJobLink}>
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
                    message: 'Please enter your first name.',
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
                    message: 'Please enter your last name.',
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
                  message: 'Please enter your email address.',
                },
                pattern: {
                  value:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Please enter a valid email address.',
                },
              }),
            }}
            label='Email address'
            size='small'
            onChange={() => {
              clearErrors('email')
            }}
          />

          {errors.email && errorText(errors.email.message)}

          {emailError && errorText(emailError) /* Error message from the API response */}
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
                    message: 'Please enter your contact number.',
                  },
                }),
              }}
              label='Contact number'
              size='small'
              onChange={(e) => {
                clearErrors('contactNumber')

                setValue('contactNumber', handleNumericInput(e.target.value))
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
                  message: 'Please enter your password.',
                },
                minLength: {
                  value: 8,
                  message: 'Please enter a longer password (minimum of 8 characters)',
                },
                maxLength: {
                  value: 16,
                  message: 'Please enter a shorter password (maximum of 16 characters)',
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
          {resume ? (
            <div className={styles.uploadedResume}>
              <div className={styles.leftResume}>
                <div className={styles.documentDiv}>
                  <img src={DocumentIcon} alt='document' width='21' height='21' />
                </div>
                <Text textStyle='sm' bold className={styles.resumeName}>
                  {' '}
                  {resume?.name}{' '}
                </Text>
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

                    clearErrors('resume')
                    setResume(file)
                  }}
                />
              </MaterialButton>
            </div>
          )}
          <Text textColor='darkgrey' textStyle='xsm'>
            Supported file type: PDF, DOC, DOCX. Max. file size: 5MB
          </Text>

          {errors.resume && errorText(errors.resume.message)}
        </div>

        <div className={styles.quickApplyFormField}>
          {screeningQuestions.length > 0 && (
            <Text textStyle='lg' bold>
              Questions from recruiter
            </Text>
          )}

          {screeningQuestions.length > 0 &&
            screeningQuestions.map((question, i) => {
              return (
                <div key={i} className={styles.question}>
                  <Text textStyle='lg'>
                    {i + 1}. {question}
                  </Text>

                  <MaterialTextField
                    refs={{
                      ...register(`screening_answer_${i}`, {
                        required: {
                          value: true,
                          message: 'Please enter a valid answer.',
                        },
                      }),
                    }}
                    className={styles.answer}
                    label='Answer'
                    multiline
                    rows={9}
                    variant='outlined'
                    size='small'
                  />
                  {errors[`screening_answer_${i}`] &&
                    errorText(errors[`screening_answer_${i}`].message)}
                </div>
              )
            })}

          {screeningQuestions.length === 0 && (
            <div className={styles.question}>
              <Text textStyle='md'>
                On Bossjob, you can message with the recruiter in real-time. Impress the recruiter
                by sending a message first. (Tips: the reason why you are the perfect fit for this
                job)
              </Text>

              <MaterialTextField
                refs={{
                  ...register('firstMessage', {
                    required: {
                      value: true,
                      message: 'Please enter a valid answer.',
                    },
                  }),
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
          )}
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
              <Text textStyle='sm'>Email me exclusive newsletters & job updates from Bossjob.</Text>
            }
          />

          <Text textColor='darkgrey' textStyle='xsm'>
            By signing up, I have read and agreed to Terms of Use and Privacy Policy
          </Text>
        </div>
      </form>
    </Modal>
  )
}

export default QuickApplyModal
