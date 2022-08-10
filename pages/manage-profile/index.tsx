import React, { useState, useEffect, useCallback } from 'react'

/* Vendors */
import { END } from 'redux-saga'
import { wrapper } from 'store'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import useEmblaCarousel from 'embla-carousel-react'
import moment from 'moment'

/* Redux actions */
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { manageUserWorkExperiencesRequest } from 'store/actions/users/manageUserWorkExperiences'
import { manageUserEducationsRequest } from 'store/actions/users/manageUserEducations'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { uploadUserResumeService } from 'store/services/users/uploadUserResume'

/* Components */
import Layout from 'components/Layout'
import Text from 'components/Text'
import ProfileLayout from 'components/ProfileLayout'
import ProfileSettingCard from 'components/ProfileSettingCard'
import UploadResume from 'components/UploadResume'
import MaterialButton from 'components/MaterialButton'
import ReadMore from 'components/ReadMore'

import EditProfileModal from 'components/EditProfileModal'
import EditWorkExperienceModal from 'components/EditWorkExperienceModal'
import EditEducationModal from 'components/EditEducationModal'

/* Helpers */
import useWindowDimensions from 'helpers/useWindowDimensions'
import { getCookie } from 'helpers/cookies'
import { useFirstRender } from 'helpers/useFirstRender'
import { getYearMonthDiffBetweenDates } from 'helpers/formatter'

/* Assets */
import {
  ResumeTemplate1,
  ResumeTemplate2,
  DownloadWhiteIcon,
  CarouselRightRoundedBlueButton,
  AddIcon,
  PencilIcon,
  TrashIcon,
} from 'images'

/* Styles */
import classNames from 'classnames'
import styles from './ManageProfile.module.scss'
import { Chip } from '@mui/material'
import EditSkillModal from 'components/EditSkillModal'
import { getJobCategoryList } from 'helpers/jobPayloadFormatter'


const RenderProfileView = ({ userDetail, handleModal }: any) => {
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const isMobile = width < 768 ? true : false
  const { work_experiences: workExperiences, educations, skills } = userDetail

  const handleAddData = (type) => {
    switch (type) {
      case 'workExperience':
        handleModal(type, true)
      case 'education':
        handleModal(type, true)
      default:
        break
    }
  }

  const handleEditData = (type, data) => {
    switch (type) {
      case 'workExperience':
        handleModal(type, true, data)
      case 'education':
        handleModal(type, true, data)
      default:
        break
    }
  }

  const handleWorkExpModal = (workExp = null) => {
    handleModal('workExperience', true, workExp)
  }

  const handleEducationModal = (education = null) => {
    handleModal('education', true, education)
  }

  const handleDeleteData = async (type, id) => {
    switch (type) {
      case 'workExperience':
        dispatch(
          manageUserWorkExperiencesRequest({
            isDelete: true,
            workExperienceId: id,
          })
        )
      case 'education':
        dispatch(
          manageUserEducationsRequest({
            isDelete: true,
            educationId: id,
          })
        )
      default:
        break
    }
  }

  const renderWorkExperienceSection = (sectionName) => {
    return (
      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <Text textStyle='xl' textColor='primaryBlue' bold>
            Work Experience
          </Text>
          <div className={styles.iconWrapper} onClick={() => handleAddData(sectionName)}>
            <img src={AddIcon} width='14' height='14' />
          </div>
        </div>
        <div className={styles.sectionContent}>
          {workExperiences.map((workExp) => {
            const workingPeriodFrom = moment(workExp?.working_period_from)
            const workingPeriodTo = moment(workExp?.working_period_to)
            const dateDiff = getYearMonthDiffBetweenDates(
              workingPeriodFrom,
              workExp.is_currently_work_here
                ? moment(new Date()).format('YYYY-MM-DD')
                : workingPeriodTo
            )
            return (
              <div key={workExp.id} className={styles.workExpSection}>
                <div className={styles.titleWrapper}>
                  <Text textStyle='lg' bold>
                    {workExp.job_title}
                  </Text>
                  <div className={styles.iconWrapperDouble}>
                    <div
                      className={styles.iconWrapper}
                      onClick={() => handleEditData(sectionName, workExp)}
                    >
                      <img src={PencilIcon} width='22' height='22' />
                    </div>
                    <div
                      className={styles.iconWrapper}
                      onClick={() => handleDeleteData(sectionName, workExp.id)}
                    >
                      <img src={TrashIcon} width='14' height='14' />
                    </div>
                  </div>
                </div>
                <div className={styles.companyInfoWrapper}>
                  <Text textStyle='lg'>{workExp.company}</Text>
                  <Text textStyle='lg'>{`${workExp.location}${
                    workExp.location && workExp.country_key === 'ph' ? ', Philippines' : ''
                  }`}</Text>
                </div>
                <Text textStyle='base' textColor='darkgrey'>
                  {workingPeriodFrom.format('MMMM yyyy')} to{' '}
                  {workExp?.is_currently_work_here
                    ? 'Present'
                    : workingPeriodTo.format('MMMM yyyy')}{' '}
                  {dateDiff ? `(${dateDiff})` : ''}
                </Text>
                {workExp?.description && (
                  <ReadMore
                    size={isMobile ? 210 : 300}
                    text={workExp?.description}
                    className={styles.readMoreDescriptionWrapper}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderEducationSection = (sectionName) => {
    return (
      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <Text textStyle='xl' textColor='primaryBlue' bold>
            Education
          </Text>
          <div className={styles.iconWrapper} onClick={() => handleAddData(sectionName)}>
            <img src={AddIcon} width='14' height='14' />
          </div>
        </div>
        <div className={styles.sectionContent}>
          {educations.map((education) => {
            let studyPeriod = ""

            if (education?.study_period_from) {
              studyPeriod += moment(education?.study_period_from).format('MMM yyyy')

              if (education?.is_currently_studying === true) {
                studyPeriod += " - Present"
              } else if (education?.is_currently_studying === false && education?.study_period_to) {
                studyPeriod += " - " + moment(education?.study_period_to).format('MMM yyyy')
              }
            }

            return (
              <div key={education.id} className={styles.educationSection}>
                <div className={styles.titleWrapper}>
                  <Text textStyle='lg' bold>
                    {education.school}
                  </Text>
                  <div className={styles.iconWrapperDouble}>
                    <div
                      className={styles.iconWrapper}
                      onClick={() => handleEditData(sectionName, education)}
                    >
                      <img src={PencilIcon} width='22' height='22' />
                    </div>
                    <div
                      className={styles.iconWrapper}
                      onClick={() => handleDeleteData(sectionName, education.id)}
                    >
                      <img src={TrashIcon} width='14' height='14' />
                    </div>
                  </div>
                </div>
                {education?.degree &&
                  <Text textStyle='lg'>
                    {education.degree}
                  </Text>
                }
                { studyPeriod !== "" &&
                  <Text textStyle='base' textColor='darkgrey' >
                    {studyPeriod}
                  </Text>
                }
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const rendeSkillSection = () => {
    return (
      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <Text textStyle='xl' textColor='primaryBlue' bold>
            Skills
          </Text>
          <div className={styles.iconWrapper} onClick={() => handleModal('skills', true)}>
            <img src={AddIcon} width='14' height='14' />
          </div>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.skill}>
            {skills.map((skill, i) => {
              return (
                <Chip
                  key={i}
                  className={styles.skillChip}
                  label={skill}
                  variant='filled'
                  color='info'
                  size='small' 
                />
              )
            })}
          </div>
        </div>
      </div>
    )
  }
  return (
    <React.Fragment>
      {workExperiences?.length > 0 ? (
        renderWorkExperienceSection('workExperience')
      ) : (
        <ProfileSettingCard
          title='Work Experience'
          description='Showcase your past contributions and that you can be an asset to potential employer.'
          buttonText='Add work experience'
          // eslint-disable-next-line
          onClick={() => handleWorkExpModal()}
        />
      )}

      {educations?.length > 0 ? (
        renderEducationSection('education')
      ) : (
        <ProfileSettingCard
          title='Education'
          description='Highlight your academic qualifications and achievements.'
          buttonText='Add education'
          // eslint-disable-next-line
          onClick={() => handleEducationModal()}
        />
      )}

      {skills?.length > 0 ? (
        rendeSkillSection()
      ) : (
        <ProfileSettingCard
          title='Skills'
          description='Include relevant skill and keywords to boost your chances of getting an interview.'
          buttonText='Add skills'
          // eslint-disable-next-line
          onClick={() => handleModal('skills', true)}
        />
      )}
      <ProfileSettingCard
        title='Links'
        description='Show recruiters your work by sharing your websites, portfolio, articles, or any relevant links.'
        buttonText='Add links'
        // eslint-disable-next-line
        onClick={() => {}}
      />
      <ProfileSettingCard
        title='Licences And Certifications'
        description='Stand out among the rest by sharing that expertise that you have earned to show your passion for the job.'
        buttonText='Add licenses & cert'
        // eslint-disable-next-line
        onClick={() => {}}
      />
    </React.Fragment>
  )
}

const RenderPreferencesView = () => {
  return <React.Fragment>preferences content</React.Fragment>
}

const RenderResumeView = ({ userDetail }: any) => {
  const accessToken = getCookie('accessToken')
  const isFirstRender = useFirstRender()
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const isSuccessfulUpload = useSelector((store: any) => store.users.uploadUserResume.response)

  const initialDownloadState = {
    creative: false,
    corporate: false,
  }
  const [resume, setResume] = useState(userDetail.resume || null)
  const [isTemplateDownloadable, setIsTemplateDownloadable] = useState(initialDownloadState)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    inViewThreshold: 0.7,
    slidesToScroll: width < 799 ? 1 : 2,
  })

  useEffect(() => {
    if (width < 799) {
      setIsTemplateDownloadable({ creative: true, corporate: true })
    }
  }, [])

  useEffect(() => {
    if (!isFirstRender) dispatch(fetchUserOwnDetailRequest({ accessToken }))
  }, [isSuccessfulUpload])

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
    emblaApi.reInit()
  }, [emblaApi, setScrollSnaps, onSelect])

  const handleDeleteResume = () => {
    setResume(null)
  }

  const handleUploadResume = (file) => {
    uploadUserResumeService(file)
    .then((response) => {
      setResume(response.data.data)
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

  const handleDownloadResume = (type) => {
    const sourcePath = process.env.DOCUMENT_GENERATOR_URL

    switch (type) {
      case 'corporate':
        // TODO: replace this with user's corporate resume
        window.open(`${sourcePath}/resume/pro/bossjob.pdf?token=${accessToken}`, '_blank')
        break
      case 'creative':
        // TODO: replace this with user's creative resume
        window.open(`${sourcePath}/resume/creative/bossjob.pdf?token=${accessToken}`, '_blank')
        break
      default:
        break
    }
  }

  const onTemplateHover = (type, boolean) => {
    if (width > 799) {
      setIsTemplateDownloadable({
        ...initialDownloadState,
        [type]: boolean,
      })
    }
  }
  return (
    <React.Fragment>
      <div className={styles.sectionContainer}>
        <Text textColor='primaryBlue' textStyle='xl' bold>
          Upload your own resume
        </Text>
        <Text tagName='p' textStyle='lg'>
          Resume is an essential tool to get you to the next step in your job hunting process.
          Impress recruiters with additional information from your Bossjob profile.
        </Text>
        <UploadResume
          title='resume'
          resume={resume}
          handleDelete={handleDeleteResume}
          handleUpload={handleUploadResume}
          buttonClassname={styles.buttonCTA}
        />
      </div>
      <div className={styles.sectionContainer}>
        <Text textColor='primaryBlue' textStyle='xl' bold>
          Bossjob resume
        </Text>
        <Text tagName='p' textStyle='lg'>
          As you build your profile at Bossjob, we create your resume for you. You can choose from
          the available templates and use your newly improve resume to apply for job opening at
          Bossjob.
        </Text>
        <div className={styles.resumePreview}>
          <div className={styles.embla}>
            <div className={styles.emblaViewport} ref={emblaRef}>
              <div className={styles.emblaContainer}>
                <div className={styles.emblaSlide}>
                  <div
                    className={styles.emblaSlideInner}
                    onMouseEnter={() => onTemplateHover('corporate', true)}
                    onMouseLeave={() => onTemplateHover('corporate', false)}
                  >
                    <img
                      src={ResumeTemplate1}
                      alt='Corporate Template'
                      className={`${styles.resumeTemplateItem}`}
                    />
                    <MaterialButton
                      variant='contained'
                      size='medium'
                      capitalize
                      onClick={() => handleDownloadResume('corporate')}
                      className={
                        isTemplateDownloadable?.corporate
                          ? styles.downloadResumeButtonActive
                          : styles.downloadResumeButton
                      }
                      sx={{ display: isTemplateDownloadable?.corporate ? 'flex' : 'none' }}
                    >
                      <img
                        src={DownloadWhiteIcon}
                        alt='Download Corporate Template'
                        className={styles.downloadIcon}
                      />
                      <Text textStyle='lg' textColor='white' className={styles.downloadText}>
                        Download
                      </Text>
                    </MaterialButton>
                  </div>
                </div>
                <div className={styles.emblaSlide}>
                  <div
                    className={styles.emblaSlideInner}
                    onMouseEnter={() => onTemplateHover('creative', true)}
                    onMouseLeave={() => onTemplateHover('creative', false)}
                  >
                    <img
                      src={ResumeTemplate2}
                      alt='Creative Template'
                      className={`${styles.resumeTemplateItem}`}
                    />
                    <MaterialButton
                      variant='contained'
                      size='medium'
                      capitalize
                      onClick={() => handleDownloadResume('creative')}
                      className={
                        isTemplateDownloadable?.creative
                          ? styles.downloadResumeButtonActive
                          : styles.downloadResumeButton
                      }
                    >
                      <img
                        src={DownloadWhiteIcon}
                        alt='Download Creative Template'
                        className={styles.downloadIcon}
                        width='24px'
                        height='24px'
                      />
                      <Text textStyle='lg' textColor='white' className={styles.downloadText}>
                        Download
                      </Text>
                    </MaterialButton>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.slidesControl}>
              {selectedIndex >= 1 && (
                <div
                  className={classNames([styles.slidesControlItem, styles.slidesControlLeft])}
                  onClick={scrollPrev}
                >
                  <img
                    src={CarouselRightRoundedBlueButton}
                    alt='previous'
                    className={styles.carouselPrev}
                  />
                </div>
              )}
              {selectedIndex < 1 && (
                <div
                  className={classNames([styles.slidesControlItem, styles.slidesControlRight])}
                  onClick={scrollNext}
                >
                  <img
                    src={CarouselRightRoundedBlueButton}
                    alt='next'
                    className={styles.carouselNext}
                  />
                </div>
              )}
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
        </div>
      </div>
    </React.Fragment>
  )
}
// TODO: Remove this page after testing
const ManageProfilePage = ({ config }: any) => {
  const router = useRouter()
  const {
    query: { tab },
  } = router
  const [tabValue, setTabValue] = useState<string | string[]>(tab || 'profile')
  const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail.response)
  const jobCategoryList = getJobCategoryList(config).map((category) => {
    return {
      label: category.value,
      value: category.id
    }
  })

  const [modalState, setModalState] = useState({
    profile: {
      showModal: false,
      data: null,
    },
    workExperience: {
      showModal: false,
      data: null,
    },
    education: {
      showModal: false,
      data: null,
    },
    skills: {
      showModal: false,
      data: null,
    },
    links: {
      showModal: false,
      data: null,
    },
    license: {
      showModal: false,
      data: null,
    },
    jobPreferences: {
      showModal: false,
      data: null,
    },
  })

  const handleModal = (modalName, showModal, data, callbackFunc) => {
    setModalState({
      ...modalState,
      [modalName]: {
        showModal: showModal,
        data: data,
      },
    })
    if (callbackFunc) {
      callbackFunc()
    }
    
  }

  return (
    <Layout>
      <EditProfileModal
        modalName='profile'
        showModal={modalState.profile.showModal}
        config={config}
        userDetail={userDetail}
        handleModal={handleModal}
      />
      <EditWorkExperienceModal
        modalName='workExperience'
        showModal={modalState.workExperience.showModal}
        data={modalState.workExperience.data}
        config={config}
        handleModal={handleModal}
      />
      <EditEducationModal
        modalName='education'
        showModal={modalState.education.showModal}
        education={modalState.education.data}
        config={config}
        handleModal={handleModal}
      />
      <EditSkillModal
        modalName='skills'
        showModal={modalState.skills.showModal}
        categoryList={jobCategoryList}
        skills={userDetail.skills}
        handleModal={handleModal}
      />
      <ProfileLayout
        userDetail={userDetail}
        tabValue={tabValue}
        setTabValue={setTabValue}
        modalName='profile'
        handleModal={handleModal}
      >
        {tabValue === 'profile' && (
          <RenderProfileView userDetail={userDetail} handleModal={handleModal} config={config}/>
        )}
        {tabValue === 'job-preferences' && <RenderPreferencesView />}
        {tabValue === 'resume' && <RenderResumeView userDetail={userDetail} />}
      </ProfileLayout>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return {
      redirect: {
        destination: '/login/jobseeker?redirect=/jobseeker-complete-profile/1',
        permanent: false,
      },
    }
  }

  store.dispatch(fetchConfigRequest())
  store.dispatch(fetchUserOwnDetailRequest({ accessToken }))
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response

  return {
    props: {
      config,
      accessToken,
    },
  }
})

export default ManageProfilePage
