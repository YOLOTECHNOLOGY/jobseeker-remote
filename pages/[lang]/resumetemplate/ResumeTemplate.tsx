import { useCallback, useState, useEffect } from 'react'

/* Vendors */
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import useEmblaCarousel from 'embla-carousel-react'
import { useSelector } from 'react-redux'
import useGetStarted from 'hooks/useGetStarted'

// Components
import Layout from 'components/Layout'
// import SEO from 'components/SEO'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'
import SendTOP from 'components/GetStarted/SendTOP/SendTOP'
import MagicLink from 'components/GetStarted/MagicLink/MagicLink'

// Helpers
import useWindowDimensions from 'helpers/useWindowDimensions'
import { removeItem, setItem } from 'helpers/localStorage'
import { useFirstRender } from 'helpers/useFirstRender'
import { getCookie } from 'helpers/cookies'
// Images
import { ResumeTemplatePreview, ResumeTemplate1, ResumeTemplate2 } from 'images'

// Styles
import styles from './ResumeTemplate.module.scss'

const COUNT_DOWN_VERIFY_DEFAULT = 60

const errorText = (errorMessage: string) => {
  return (
    <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
      {errorMessage}
    </Text>
  )
}

const ResumeTemplate = ({ lang ,query}: any) => {
  const {
    step,
    email,
    setEmaile,
    handleSendEmailTOP,
    isLoading,
    userId,
    emailTOP,
    setEmailTOP,
    emailOTPInputDisabled,
    handleAuthenticationJobseekersLogin,
    handleAuthenticationSendEmailMagicLink,
    emailTOPError
  } = useGetStarted()

  const router = useRouter()
  const firstRender = useFirstRender()
  const { width } = useWindowDimensions()
  const userCookie = getCookie('user') || null
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])
  const [emailBtnDisabled, setEmailBtnDisabled] = useState<boolean>(false)
  const [emailError, setEmailError] = useState(null)

  const userInfo = useSelector((store: any) => store.auth.jobseekersLogin.response)

  useEffect(() => {
    setEmailBtnDisabled(userCookie ? false : true)
  }, [])

  useEffect(() => {
    if (firstRender) {
      return
    }

    if (!Object.keys(userInfo).length) {
      return
    }

    if (userId) {
      router.push(`/${query}/manage-profile?tab=resume`)
    } else {
      setItem('isRegisterModuleRedirect', '/manage-profile?tab=resume')
      router.push(`/${query}/jobseeker-complete-profile/1`)
    }
  }, [userInfo])

  useEffect(() => {
    if (firstRender) {
      return
    }

    if (emailError) {
      setEmailBtnDisabled(true)
    } else {
      setEmailBtnDisabled(false)
    }
  }, [emailError])

  useEffect(() => {
    if (firstRender) {
      return
    }

    let errorText = null
    if (!/\S+@\S+\.\S+/.test(email)) {
      if (!email.length) {
        errorText = resumetemplate.form.emptyError
      } else {
        errorText = resumetemplate.form.validError
      }
    }
    setEmailError(errorText)
  }, [email])

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

  const { resumetemplate } = lang
  return (
    <Layout lang={lang}>
      {/* <SEO
        title='Free Resume Template to Edit & Download | Bossjob.ph'
        description='Free resume template & sample for you to edit and download on Bossjob. Customize your resume and add career objectives, work experiences and job skills!'
        canonical='/resumetemplate'
      /> */}
      <div
        className={classNames([
          styles.resumeTemplate,
          step !== 1 ? styles.resumeTemplateContainer : ''
        ])}
      >
        {step == 1 && (
          <div>
            <div className={styles.resumeTemplateHero}>
              <div className={styles.resumeTemplateHeroContent}>
                <form className={styles.resumeTemplateForm}>
                  <Text tagName='h1' textStyle='xxxl' bold className={styles.formHeader}>
                    {resumetemplate.title}
                  </Text>
                  <Text textStyle='xl' className={styles.formSubHeader}>
                    {resumetemplate.subTitle}
                  </Text>
                  {!userCookie && (
                    <div>
                      <MaterialTextField
                        id='email'
                        label={resumetemplate.form.label}
                        variant='outlined'
                        value={email}
                        size='small'
                        defaultValue={email}
                        autoComplete='off'
                        error={emailError ? true : false}
                        onChange={(e) => setEmaile(e.target.value)}
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
                        handleSendEmailTOP()
                        removeItem('quickUpladResume')
                      }
                    }}
                    isLoading={isLoading}
                    disabled={emailBtnDisabled}
                  >
                    <Text textColor='white'>{resumetemplate.createBtn}</Text>
                  </MaterialButton>
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
                {resumetemplate.howToCreate.title}
              </Text>
              <div className={styles.sectionContentHalfDivider}></div>
              <ul className={styles.resumeStepsList}>
                <li className={styles.resumeStepsItem}>
                  <Text textStyle='lg'>{resumetemplate.howToCreate.step1}</Text>
                </li>
                <li className={styles.resumeStepsItem}>
                  <Text textStyle='lg'>{resumetemplate.howToCreate.step2}</Text>
                </li>
                <li className={styles.resumeStepsItem}>
                  <Text textStyle='lg'> {resumetemplate.howToCreate.step3}</Text>
                </li>
                <li className={styles.resumeStepsItem}>
                  <Text textStyle='lg'>{resumetemplate.howToCreate.step4}</Text>
                </li>
              </ul>
            </div>
            <div className={styles.sectionContentDivider}></div>
            <div className={styles.resumeTemplateSection}>
              <Text tagName='h2' textStyle='xxxl' bold className={styles.sectionHeader}>
                {resumetemplate.haveAQuestion}
              </Text>
              <div className={styles.sectionContentHalfDivider}></div>
              <Text tagName='h2' textStyle='xl' bold className={styles.sectionSubHeader}>
                {resumetemplate.freeLabel}
              </Text>
              <div className={styles.sectionContentRegDivider}></div>
              <Text textStyle='lg' className={styles.sectionSubContent}>
                {resumetemplate.freeAnswer}
              </Text>
              <div className={styles.sectionContentHalfDivider}></div>
            </div>
            <div className={styles.resumeTemplateContainer}>
              <div className={styles.resumeTemplateContent}>
                <div className={styles.sectionContentHalfDivider}></div>
                <div className={styles.resumeTemplateOtherSection}>
                  <Text tagName='h2' textStyle='xl' bold className={styles.sectionSubHeader}>
                    {resumetemplate.chooseTemplate}
                  </Text>
                  <div className={styles.sectionContentRegDivider}></div>
                  <Text textStyle='lg' className={styles.sectionSubContent}>
                    {resumetemplate.chooseTemplateAnswer}
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
                        className={
                          index === selectedIndex ? styles.emblaDotActive : styles.emblaDot
                        }
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
                {resumetemplate.editLater}
              </Text>
              <div className={styles.sectionContentRegDivider}></div>
              <Text textStyle='lg' className={styles.sectionSubContent}>
                {resumetemplate.editLaterAnswer}
              </Text>
              <div className={styles.sectionContentDivider}></div>
            </div>
          </div>
        )}

        {step == 2 && (
          <div className={styles.resumeTemplateSendOTP}>
            <SendTOP
              userId={userId}
              COUNT_DOWN_VERIFY_DEFAULT={COUNT_DOWN_VERIFY_DEFAULT}
              handleSendEmailTOP={handleSendEmailTOP}
              email={email}
              emailTOP={emailTOP}
              setEmailTOP={setEmailTOP}
              isLoading={isLoading}
              emailOTPInputDisabled={emailOTPInputDisabled}
              login={handleAuthenticationJobseekersLogin}
              magicLink={handleAuthenticationSendEmailMagicLink}
              emailTOPError={emailTOPError}
              lang={lang.getStatred}
            />
          </div>
        )}

        {step == 3 && (
          <div className={styles.resumeTemplateSendOTP}>
            {' '}
            <MagicLink userId={userId} email={email} />
          </div>
        )}
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ req ,query}) {
  const accessToken = req.cookies.accessToken

  if (accessToken) {
    return {
      redirect: {
        destination: `${process.env.OLD_PROJECT_URL}/${query.lang}/dashboard/profile/jobseeker`,
        permanent: false
      }
    }
  }
  return {
    props: {
      query:query.lang,
      seoMetaTitle: 'Free Resume Template to Edit & Download | Bossjob.ph',
      seoMetaDescription:
        'Free resume template & sample for you to edit and download on Bossjob. Customize your resume and add career objectives, work experiences and job skills!',
      canonicalUrl: '/resumetemplate'
    }
  }
}

export default ResumeTemplate
