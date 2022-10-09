import { useCallback, useState, useEffect } from 'react'

/* Vendors */
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import useEmblaCarousel from 'embla-carousel-react'
import { useDispatch, useSelector } from 'react-redux'

import { registerJobseekerRequest } from 'store/actions/auth/registerJobseeker'

// Components
import Layout from 'components/Layout'
import SEO from 'components/SEO'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'
import Link from 'components/Link'

// Helpers
import useWindowDimensions from 'helpers/useWindowDimensions'

import { getCookie } from 'helpers/cookies'
// Images
import { ResumeTemplatePreview, ResumeTemplate1, ResumeTemplate2 } from 'images'

// Styles
import styles from './ResumeTemplate.module.scss'

const ResumeTemplate = () => {
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])
  const userCookie = getCookie('user') || null

  const [firstName, setFirstName] = useState('')
  const [firstNameError, setFirstNameError] = useState(null)
  const [lastName, setLastName] = useState('')
  const [lastNameError, setLastNameError] = useState(null)

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(null)

  const isRegisteringJobseeker = useSelector((store: any) => store.auth.registerJobseeker.fetching)
  const registerJobseekerState = useSelector((store: any) => store.auth.registerJobseeker)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    inViewThreshold: 0.7,
    slidesToScroll: width < 768 ? 1 : 2
  })
  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }, [emblaApi])

  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
  }, [emblaApi, setScrollSnaps, onSelect])

  useEffect(() => {
    if (registerJobseekerState.error) {
      if (registerJobseekerState.error['email']) {
        if (registerJobseekerState.error['email'] == 'The email has already been taken.') {
          setEmailError(
            <p>
              A user with this email address already exists. Please enter a different email address
              or <Link to='/get-started?redirect=/resumetemplate'>log in</Link>.
            </p>
          )
        } else {
          setEmailError(registerJobseekerState.error['email'])
        }
      }
    }
  }, [registerJobseekerState])

  const errorText = (errorMessage: string) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
        {errorMessage}
      </Text>
    )
  }

  const onRegister = () => {
    let invalidEmail = false

    if (!email) setEmailError('Please enter your email address.')
    else {
      const emailPattern =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      if (!emailPattern.test(email)) {
        invalidEmail = true
        setEmailError('Please enter a valid email address.')
      } else setEmailError(null)
    }

    if (!firstName) {
      setFirstNameError('Please enter your first name.')
    } else {
      setFirstNameError(null)
    }

    if (!lastName) {
      setLastNameError('Please enter your last name.')
    } else {
      setLastNameError(null)
    }

    if (email && !invalidEmail && firstName && lastName) {
      const payload = {
        email,
        first_name: firstName,
        last_name: lastName,
        source: 'free_resume'
      }

      dispatch(registerJobseekerRequest({ ...payload }))
    }
  }

  return (
    <Layout>
      <SEO
        title='Free Resume Template to Edit & Download | Bossjob.ph'
        description='Free resume template & sample for you to edit and download on Bossjob. Customize your resume and add career objectives, work experiences and job skills!'
        canonical='/resumetemplate'
      />
      <div className={styles.resumeTemplate}>
        <div className={styles.resumeTemplateHero}>
          <div className={styles.resumeTemplateHeroContent}>
            <form className={styles.resumeTemplateForm}>
              <Text tagName='h1' textStyle='xxxl' bold className={styles.formHeader}>
                Free resume template
              </Text>
              <Text textStyle='xl' className={styles.formSubHeader}>
                Create and download resume in a minute.
              </Text>
              {!userCookie && (
                <div>
                  <div className={styles.fullWidth}>
                    <div style={{ marginRight: '15px' }}>
                      <MaterialTextField
                        value={firstName}
                        defaultValue={firstName}
                        label='First name'
                        size='small'
                        className={styles.halfWidth}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      {firstNameError && errorText(firstNameError)}
                    </div>

                    <div>
                      <MaterialTextField
                        value={lastName}
                        defaultValue={lastName}
                        label='Last name'
                        size='small'
                        className={styles.halfWidth}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      {lastNameError && errorText(lastNameError)}
                    </div>
                  </div>

                  <MaterialTextField
                    id='email'
                    label='Email address'
                    variant='outlined'
                    value={email}
                    size='small'
                    defaultValue={email}
                    autoComplete='off'
                    error={emailError ? true : false}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.fullWidth}
                  />
                  {emailError && errorText(emailError)}
                </div>
              )}

              <MaterialButton
                variant='contained'
                capitalize
                className={styles.fullWidthButton}
                onClick={() => {
                  if (userCookie) {
                    userCookie.is_profile_completed
                      ? router.push('/manage-profile?tab=resume')
                      : router.push('/jobseeker-complete-profile/1')
                  } else {
                    onRegister()
                  }
                }}
                isLoading={isRegisteringJobseeker}
              >
                <Text textColor='white'>Create Resume</Text>
              </MaterialButton>

              {!userCookie && (
                <Text tagName='p' textStyle='base' style={{ textAlign: 'center' }}>
                  Already on Bossjob?
                  <Link to='/get-started?redirect=/resumetemplate'>
                    <Text textColor='primaryBlue' underline>
                      {' '}
                      Get started
                    </Text>
                  </Link>
                </Text>
              )}
            </form>
            <img
              src={ResumeTemplatePreview}
              alt='Resume Template'
              className={styles.resumeTemplatePreview}
            />
          </div>
        </div>
        <div className={styles.sectionContentDivider}></div>
        <div className={styles.resumeTemplateSection}>
          <Text tagName='h2' textStyle='xxxl' bold className={styles.sectionHeader}>
            How to create resume template
          </Text>
          <div className={styles.sectionContentHalfDivider}></div>
          <ul className={styles.resumeStepsList}>
            <li className={styles.resumeStepsItem}>
              <Text textStyle='lg'>
                Fill in your name as well as a valid email (important that you enter a valid email
                which will be used in your resume template)
              </Text>
            </li>
            <li className={styles.resumeStepsItem}>
              <Text textStyle='lg'>
                Click on “Create Resume” and proceed to fill in more information such as personal
                summary and career objectives, education, experience, skills, and more.
              </Text>
            </li>
            <li className={styles.resumeStepsItem}>
              <Text textStyle='lg'>Download, print and save your new resume</Text>
            </li>
            <li className={styles.resumeStepsItem}>
              <Text textStyle='lg'>
                Update your online resume any time and create new resume template whenever you wish
                to
              </Text>
            </li>
          </ul>
        </div>
        <div className={styles.sectionContentDivider}></div>
        <div className={styles.resumeTemplateSection}>
          <Text tagName='h2' textStyle='xxxl' bold className={styles.sectionHeader}>
            Have a question?
          </Text>
          <div className={styles.sectionContentHalfDivider}></div>
          <Text tagName='h2' textStyle='xl' bold className={styles.sectionSubHeader}>
            Is it free?
          </Text>
          <div className={styles.sectionContentRegDivider}></div>
          <Text textStyle='lg' className={styles.sectionSubContent}>
            Yes, Bossjob resume generation service is free. You can create as many resume as you
            want. You can choose from different themes of resume samples and use different resume
            sample for different job applications
          </Text>
          <div className={styles.sectionContentHalfDivider}></div>
        </div>
        <div className={styles.resumeTemplateContainer}>
          <div className={styles.resumeTemplateContent}>
            <div className={styles.sectionContentHalfDivider}></div>
            <div className={styles.resumeTemplateOtherSection}>
              <Text tagName='h2' textStyle='xl' bold className={styles.sectionSubHeader}>
                How many templates can I choose from?
              </Text>
              <div className={styles.sectionContentRegDivider}></div>
              <Text textStyle='lg' className={styles.sectionSubContent}>
                You can choose from 2 templates, professional or creative resume samples. You can
                immediately use your newly improved resume to apply for job openings on Bossjob.
              </Text>
            </div>
            <div className={styles.sectionContentRegDivider}></div>

            <div className={styles.embla}>
              <div className={styles.emblaViewport} ref={emblaRef}>
                <div className={styles.emblaContainer}>
                  <div className={styles.emblaSlide}>
                    <div className={styles.emblaSlideInner}>
                      <img
                        src={ResumeTemplate1}
                        alt='Resume Template'
                        className={`${styles.resumeTemplateItem}`}
                      />
                    </div>
                  </div>
                  <div className={styles.emblaSlide}>
                    <div className={styles.emblaSlideInner}>
                      <img
                        src={ResumeTemplate2}
                        alt='Resume Template'
                        className={`${styles.resumeTemplateItem}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.slidesControl}>
                <div
                  className={classNames([styles.slidesControlItem, styles.slidesControlLeft])}
                  onClick={scrollPrev}
                />
                <div
                  className={classNames([styles.slidesControlItem, styles.slidesControlRight])}
                  onClick={scrollNext}
                />
              </div>
              <div className={styles.sectionContentSmallDivider}></div>
              <div className={styles.emblaDots}>
                {scrollSnaps.map((_, index) => (
                  <div
                    key={index}
                    className={index === selectedIndex ? styles.emblaDotActive : styles.emblaDot}
                    onClick={() => scrollTo(index)}
                  />
                ))}
              </div>
            </div>
            <div className={styles.sectionContentRegDivider}></div>
          </div>
        </div>
        <div className={styles.sectionContentRegDivider}></div>
        <div className={styles.resumeTemplateSection}>
          <Text tagName='h2' textStyle='xl' bold className={styles.sectionSubHeader}>
            Would I be able to edit the resume template later?
          </Text>
          <div className={styles.sectionContentRegDivider}></div>
          <Text textStyle='lg' className={styles.sectionSubContent}>
            Absolutely yes. Login to your Bossjob account anytime to update your resume. You can use
            your Bossjob account as a resume bank. Keep your most updated career details in Bossjob
            and use them as your professional identity!
          </Text>
          <div className={styles.sectionContentDivider}></div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const accessToken = req.cookies.accessToken
  if (accessToken) {
    return {
      redirect: {
        destination: `${process.env.OLD_PROJECT_URL}/dashboard/profile/jobseeker`,
        permanent: false
      }
    }
  }
  return { props: {} }
}

export default ResumeTemplate
