import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react'

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
import { manageUserLicensesAndCertificationsRequest } from 'store/actions/users/manageUserLicensesAndCertifications'
import { manageUserLinksRequest } from 'store/actions/users/manageUserLinks'

/* Components */
import Layout from 'components/Layout'
import Text from 'components/Text'
import ProfileLayout from 'components/ProfileLayout'
import ProfileSettingCard from 'components/ProfileSettingCard'
import MaterialButton from 'components/MaterialButton'
import ReadMore from 'components/ReadMore'
import SeeMore from 'components/SeeMore'
import Link from 'components/Link'
import EditJobPreferencesDeleteModal from 'components/EditJobPreferencesDeleteModal'
import EditProfileModal from 'components/EditProfileModal'
import EditJobPreferencesModal from 'components/EditJobPreferencesModal'
import EditWorkExperienceModal from 'components/EditWorkExperienceModal'
import EditEducationModal from 'components/EditEducationModal'
import EditLicensesAndCertificationsModal from 'components/EditLicenseAndCertificationsModal'
import EditLinkModal from 'components/EditLinkModal'

/* Helpers */
import useWindowDimensions from 'helpers/useWindowDimensions'
import { formatSalary, formatSalaryRange, getYearMonthDiffBetweenDates } from 'helpers/formatter'
moment.locale('en')

/* Assets */
import {
  CarouselRightRoundedBlueButton,
  AddIcon,
  PencilIcon,
  TrashIcon,
  HighlightAboutYouIcon,
  HighlightEducationIcon,
  HighlightSkillIcon,
  HighlightWorkExpIcon,
  AccountSettingDeleteIconBin
} from 'images'

/* Styles */
import classNames from 'classnames'
import styles from './ManageProfile.module.scss'
import { Chip, FormControlLabel, Switch } from '@mui/material'
import EditSkillModal from 'components/EditSkillModal'
import { getCurrencyList, getJobCategoryList } from 'helpers/jobPayloadFormatter'
import EditJobPreferencesAvailabilityModal from 'components/EditJobPreferencesAvailabilityModal/EditJobPreferencesAvailabilityModal'
import { updateUserVisibilityToWorkService } from 'store/services/jobs/updateUserVisibilityToWork'
import Image from 'next/image'
import ResumeView from './ResumeSectgion'
import { getDictionary } from 'get-dictionary'
import { Left } from './icons/left'
import {
  changeCompanyIndustry,
  changeJobPreference,
  changeUserInfoValue
} from 'helpers/config/changeUserInfoValue'
import { getValueById } from 'helpers/config/getValueById'
const RenderProfileView = ({ userDetail, handleModal, config, lang }: any) => {
  const {
    manageProfile: {
      tab: { profile }
    }
  } = lang
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const isMobile = width < 768 ? true : false
  const {
    first_name: firstName,
    last_name: lastName,
    birthdate,
    location,
    xp_lvl: expLevel,
    description,
    work_experiences: workExperiences,
    educations,
    skills,
    license_certifications: licensesCertifications,
    websites
  } = userDetail
  useMemo(() => {
    changeCompanyIndustry(workExperiences, config)
  }, [workExperiences])
  const { currency_lists } = config
  const isProfileInformationFilled = !!(
    firstName &&
    lastName &&
    birthdate &&
    location &&
    expLevel &&
    description
  )

  const validProfileInformationFilled = (profile) => {
    return !!(
      profile.first_name &&
      profile.last_name &&
      profile.birthdate &&
      profile.location &&
      profile.xp_lvl &&
      profile.description
    )
  }

  const [isSliderButtonVisible, setIsSliderButtonVisible] = useState(true)
  const [isHighlightSectionVisible, setIsHighlightSectionVisible] = useState(true)

  // Display button after a few sec to prevent weird MUI bug when it's within caoursel
  const [isCarouselButtonVisible, setIsCarouselButtonVisible] = useState(false)

  const emblaOptions = {
    align: 'start',
    loop: true,
    skipSnaps: false,
    inViewThreshold: 0.7,
    slidesToScroll: width < 799 ? 1 : 2
  }

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions as any)

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }, [emblaApi])

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
    }
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
  }, [emblaApi])

  useEffect(() => {
    setTimeout(() => {
      setIsCarouselButtonVisible(true)
    }, 300)
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.reInit()
  }, [emblaApi, onSelect])

  const reInitEmbla = () => {
    if (!emblaApi) return
    emblaApi.reInit(emblaOptions as any)
  }

  useEffect(() => {
    let count = 0
    if (workExperiences?.length === 0) {
      count += 1
    }
    if (educations?.length === 0) {
      count += 1
    }
    if (skills.length === 0) {
      count += 1
    }

    if (!validProfileInformationFilled(userDetail)) {
      count += 1
    }

    if (!isMobile) {
      setIsSliderButtonVisible(() => count > 2)
      reInitEmbla()
    }
    if (isMobile) {
      setIsSliderButtonVisible(() => count > 1)
      reInitEmbla()
    }
    if (count === 0) {
      setIsHighlightSectionVisible(false)
    }
  }, [userDetail])

  const handleAddData = (type) => {
    switch (type) {
      case 'workExperience':
        handleModal(type, true)
      case 'education':
        handleModal(type, true)
      case 'license':
        handleModal(type, true)
      case 'links':
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
      case 'license':
        handleModal(type, true, data)
      case 'links':
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

  const handleLicenseAndCertificationsModal = (license = null) => {
    handleModal('license', true, license)
  }

  const handleLinksModal = (link = null) => {
    handleModal('links', true, link)
  }

  const handleDeleteData = async (type, id) => {
    switch (type) {
      case 'workExperience':
        dispatch(
          manageUserWorkExperiencesRequest({
            isDelete: true,
            workExperienceId: id
          })
        )
      case 'education':
        dispatch(
          manageUserEducationsRequest({
            isDelete: true,
            educationId: id
          })
        )
      case 'license':
        dispatch(
          manageUserLicensesAndCertificationsRequest({
            isDelete: true,
            licenseId: id
          })
        )
      case 'links':
        dispatch(
          manageUserLinksRequest({
            isDelete: true,
            linkId: id
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
            {/* Work Experience */}
            {profile.exp.title}
          </Text>
          <div className={styles.iconWrapper} onClick={() => handleAddData(sectionName)}>
            <img src={AddIcon} width='14' height='14' />
          </div>
        </div>
        <div className={styles.sectionContent}>
          {workExperiences.map((workExp) => {
            const { currency_id } = workExp
            const currencySymbol = currency_lists.find(
              ({ id }) => currency_id === id
            )?.display_symbol
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
                  <Text textStyle='lg'>{`${workExp.location || ''}${getValueById(
                    config,
                    workExp.country_id,
                    'country_id'
                  )}`}</Text>
                </div>
                <Text textStyle='base' textColor='darkgrey'>
                  {workingPeriodFrom.format('MMMM yyyy')} to{' '}
                  {workExp?.is_currently_work_here
                    ? profile.exp.present
                    : workingPeriodTo.format('MMMM yyyy')}{' '}
                  {dateDiff ? `(${dateDiff})` : ''}
                </Text>
                <div className={styles.companySecondaryInfoWrapper}>
                  {workExp?.function_job_title?.length > 0 && (
                    <Text textStyle='base' textColor='darkgrey'>
                      {workExp?.function_job_title}
                    </Text>
                  )}
                  {workExp?.company_industry && (
                    <Text textStyle='base' textColor='darkgrey'>
                      {workExp?.company_industry}
                    </Text>
                  )}
                  {workExp?.salary && workExp?.salary !== '0.00' && (
                    <Text textStyle='base' textColor='darkgrey'>
                      {currencySymbol}
                      {formatSalary(workExp?.salary)} {profile.exp.perMonth}
                    </Text>
                  )}
                </div>
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
            {profile.edu.title}
          </Text>
          <div className={styles.iconWrapper} onClick={() => handleAddData(sectionName)}>
            <img src={AddIcon} width='14' height='14' />
          </div>
        </div>
        <div className={styles.sectionContent}>
          {educations.map((education) => {
            let studyPeriod = ''
            if (education?.study_period_from) {
              studyPeriod += moment(education?.study_period_from).format('MMM yyyy')

              if (education?.is_currently_studying === true) {
                studyPeriod += ' - ' + profile.edu.present
              } else if (education?.is_currently_studying === false && education?.study_period_to) {
                studyPeriod += ' - ' + moment(education?.study_period_to).format('MMM yyyy')
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
                {education?.degree && education?.field_of_study ? (
                  <Text textStyle='lg'>
                    {education.degree} in {education.field_of_study}
                  </Text>
                ) : education?.degree ? (
                  <Text textStyle='lg'>{education.degree} </Text>
                ) : null}
                {studyPeriod !== '' && (
                  <Text textStyle='base' textColor='darkgrey'>
                    {studyPeriod}
                  </Text>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderSkillSection = () => {
    return (
      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <Text textStyle='xl' textColor='primaryBlue' bold>
            {profile.skill.title}
          </Text>
          <div className={styles.iconWrapper} onClick={() => handleModal('skills', true)}>
            <img src={AddIcon} width='14' height='14' />
          </div>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.skill}>
            <SeeMore
              count={10}
              items={skills}
              renderElement={(i, skill) => (
                <Chip
                  key={i}
                  className={styles.skillChip}
                  label={skill}
                  variant='filled'
                  color='info'
                  size='small'
                />
              )}
            />
          </div>
        </div>
      </div>
    )
  }

  // title, url, description
  const renderLinkSection = (sectionName) => {
    return (
      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <Text textStyle='xl' textColor='primaryBlue' bold>
            {profile.link.title}
          </Text>
          <div className={styles.iconWrapper} onClick={() => handleAddData(sectionName)}>
            <img src={AddIcon} width='14' height='14' />
          </div>
        </div>
        <div className={styles.sectionContent}>
          {websites.map((link) => {
            return (
              <div key={link.id} className={styles.linkSection}>
                <div className={styles.titleWrapper}>
                  {link.url && link.title ? (
                    <Link
                      className={styles.linkSectionUrl}
                      to={link.url}
                      external
                      title={link.title}
                    >
                      <Text textStyle='lg' bold>
                        {link.title}
                      </Text>
                    </Link>
                  ) : (
                    <Link
                      className={styles.linkSectionUrl}
                      to={link.url}
                      external
                      title={link.title}
                    >
                      <Text textStyle='lg' bold>
                        {link.url}
                      </Text>
                    </Link>
                  )}
                  <div className={styles.iconWrapperDouble}>
                    <div
                      className={styles.iconWrapper}
                      onClick={() => handleEditData(sectionName, link)}
                    >
                      <img src={PencilIcon} width='22' height='22' />
                    </div>
                    <div
                      className={styles.iconWrapper}
                      onClick={() => handleDeleteData(sectionName, link.id)}
                    >
                      <img src={TrashIcon} width='14' height='14' />
                    </div>
                  </div>
                </div>
                {link?.description && (
                  <ReadMore
                    size={isMobile ? 210 : 300}
                    text={link?.description}
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

  const renderLicensesAndCertificationsSection = (sectionName) => {
    return (
      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <Text textStyle='xl' textColor='primaryBlue' bold>
            {/* Licenses And Certifications */}
            {profile.licenses.title}
          </Text>
          <div className={styles.iconWrapper} onClick={() => handleAddData(sectionName)}>
            <img src={AddIcon} width='14' height='14' />
          </div>
        </div>
        <div className={styles.sectionContent}>
          {licensesCertifications.map((licenseCertification) => {
            let validityPeriod = ''

            if (licenseCertification?.issue_date) {
              validityPeriod += moment(licenseCertification?.issue_date).format('MMM yyy')

              if (licenseCertification?.is_permanent) {
                validityPeriod = validityPeriod
              } else if (licenseCertification?.expiry_date && !licenseCertification?.is_permanent) {
                validityPeriod +=
                  ' - ' + moment(licenseCertification?.expiry_date).format('MMM yyy')
              }
            }

            return (
              <div key={licenseCertification.id} className={styles.licenseCertificationSection}>
                <div className={styles.titleWrapper}>
                  <Text textStyle='lg' bold>
                    {licenseCertification.title}
                  </Text>
                  <div className={styles.iconWrapperDouble}>
                    <div
                      className={styles.iconWrapper}
                      onClick={() => handleEditData(sectionName, licenseCertification)}
                    >
                      <img src={PencilIcon} width='22' height='22' />
                    </div>
                    <div
                      className={styles.iconWrapper}
                      onClick={() => handleDeleteData(sectionName, licenseCertification.id)}
                    >
                      <img src={TrashIcon} width='14' height='14' />
                    </div>
                  </div>
                </div>
                {licenseCertification?.issuing_organisation && (
                  <Text textStyle='lg'>{licenseCertification.issuing_organisation}</Text>
                )}
                {validityPeriod !== '' && (
                  <Text textStyle='base' textColor='darkgrey'>
                    {validityPeriod}
                  </Text>
                )}
                <div style={{ height: '16px' }}></div>
                {licenseCertification?.credential_id && (
                  <Text textStyle='lg'>
                    {profile.licenses.CID}: {licenseCertification.credential_id}
                  </Text>
                )}
                {licenseCertification?.credential_url && (
                  <Link
                    className={styles.licenseCertificationSectionLink}
                    to={licenseCertification.credential_url}
                    external
                    title={licenseCertification.title}
                  >
                    <Text textStyle='lg'>{licenseCertification.credential_url}</Text>
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      {isHighlightSectionVisible && (
        <div className={styles.highlightContainer}>
          <Text textStyle='xl' bold>
            {profile.findYou}
            {/* Let employer find you faster! */}
          </Text>
          {isSliderButtonVisible && (
            <div
              className={classNames([
                styles.slidesLeftControlHighlight,
                styles.slidesControlHighlight
              ])}
            >
              <div
                className={classNames([
                  styles.slidesControlItem,
                  styles.slidesLeftControlHighlight,
                  styles.slidesLeftControlHighlight
                ])}
                onClick={scrollNext}
              >
                <Left />
              </div>
            </div>
          )}
          <div className={styles.emblaHighlight}>
            <div className={styles.emblaViewport} ref={emblaRef}>
              <div className={styles.emblaContainer}>
                {workExperiences?.length === 0 && (
                  <div className={styles.emblaSlideHighlight}>
                    <div className={styles.highlightCard}>
                      <div className={styles.highlightCardHeader}>
                        <img src={HighlightWorkExpIcon} height='35px' />
                        <Text textStyle='lg' bold>
                          {profile.exp.addWorkExp}
                        </Text>
                      </div>
                      <Text textStyle='lg' className={styles.highlightCardContent}>
                        {profile.exp.noExpTips}
                        {/* Showcase your past contributions and that you can be an asset to potential
                        employer */}
                      </Text>
                      {isCarouselButtonVisible && (
                        <MaterialButton
                          variant='contained'
                          size='medium'
                          className={styles.highlightCardButton}
                          onClick={() => handleModal('workExperience', true)}
                          style={{ height: '44px', textTransform: 'none' }}
                        >
                          <Text textStyle='lg' textColor='white'>
                            {profile.exp.addExp}
                            {/* Add experience */}
                          </Text>
                        </MaterialButton>
                      )}
                    </div>
                  </div>
                )}
                {educations?.length === 0 && (
                  <div className={styles.emblaSlideHighlight}>
                    <div className={styles.highlightCard}>
                      <div className={styles.highlightCardHeader}>
                        <img src={HighlightEducationIcon} height='35px' />
                        <Text textStyle='lg' bold>
                          {/* Add education */}
                          {profile.edu.title}
                        </Text>
                      </div>
                      <Text textStyle='lg' className={styles.highlightCardContent}>
                        {/* Highlight your academic qualifications and achievements */}
                        {profile.edu.noDataTips}
                      </Text>
                      {isCarouselButtonVisible && (
                        <MaterialButton
                          variant='contained'
                          size='medium'
                          className={styles.highlightCardButton}
                          onClick={() => handleModal('education', true)}
                          style={{ height: '44px', textTransform: 'none' }}
                        >
                          <Text textStyle='lg' textColor='white'>
                            {/* Add education */}
                            {profile.edu.addEdu}
                          </Text>
                        </MaterialButton>
                      )}
                    </div>
                  </div>
                )}
                {skills?.length === 0 && (
                  <div className={styles.emblaSlideHighlight}>
                    <div className={styles.highlightCard}>
                      <div className={styles.highlightCardHeader}>
                        <img src={HighlightSkillIcon} height='35px' />
                        <Text textStyle='lg' bold>
                          {/* Add skill */}
                          {profile.skill.title}
                        </Text>
                      </div>
                      <Text textStyle='lg' className={styles.highlightCardContent}>
                        {/* Include relevant skill and keywords to boost your chances of getting an
                        interview. */}
                        {profile.skill.noDataTips}
                      </Text>
                      {isCarouselButtonVisible && (
                        <MaterialButton
                          variant='contained'
                          size='medium'
                          className={styles.highlightCardButton}
                          onClick={() => handleModal('skills', true)}
                          style={{ height: '44px', textTransform: 'none' }}
                        >
                          <Text textStyle='lg' textColor='white'>
                            {/* Add skill */}
                            {profile.skill.addSkill}
                          </Text>
                        </MaterialButton>
                      )}
                    </div>
                  </div>
                )}
                {!isProfileInformationFilled && (
                  <div className={styles.emblaSlideHighlight}>
                    <div className={styles.highlightCard}>
                      <div className={styles.highlightCardHeader}>
                        <img src={HighlightAboutYouIcon} height='35px' />
                        <Text textStyle='lg' bold>
                          {profile.informationCard.title}
                          {/* Complete all information about you */}
                        </Text>
                      </div>
                      <Text textStyle='lg' className={styles.highlightCardContent}>
                        {/* Help the recruiter to know more about you and connect more easily with you. */}
                        {profile.informationCard.content}
                      </Text>
                      {isCarouselButtonVisible && (
                        <MaterialButton
                          variant='contained'
                          size='medium'
                          className={styles.highlightCardButton}
                          onClick={() => handleModal('profile', true)}
                          style={{ height: '44px', textTransform: 'none' }}
                        >
                          <Text textStyle='lg' textColor='white'>
                            {/* Add information */}
                            {profile.informationCard.btn}
                          </Text>
                        </MaterialButton>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {isSliderButtonVisible && (
            <div className={styles.slidesControlHighlight}>
              <div
                className={classNames([styles.slidesControlItem, styles.slidesControlHighlight])}
                onClick={scrollPrev}
              >
                <img
                  src={CarouselRightRoundedBlueButton}
                  alt='next'
                  className={styles.carouselNext}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {workExperiences?.length > 0 ? (
        renderWorkExperienceSection('workExperience')
      ) : (
        <ProfileSettingCard
          title={profile.exp.title} // 'Work Experience'
          description={profile.exp.noDataTips} // 'Showcase your past contributions and that you can be an asset to potential employer.'
          buttonText={profile.exp.addWorkExp} // 'Add work experience'
          // eslint-disable-next-line
          onClick={() => handleWorkExpModal()}
        />
      )}

      {educations?.length > 0 ? (
        renderEducationSection('education')
      ) : (
        <ProfileSettingCard
          title={profile.edu.title} // 'Education'
          description={profile.edu.noDataTips} // 'Highlight your academic qualifications and achievements.'
          buttonText={profile.edu.addEdu} // 'Add education'
          // eslint-disable-next-line
          onClick={() => handleEducationModal()}
        />
      )}

      {skills?.length > 0 ? (
        renderSkillSection()
      ) : (
        <ProfileSettingCard
          title={profile.skill.title} // 'Skills'
          description={profile.skill.noDataTips} // 'Include relevant skill and keywords to boost your chances of getting an interview.'
          buttonText={profile.skill.addSkill} // 'Add skills'
          // eslint-disable-next-line
          onClick={() => handleModal('skills', true)}
        />
      )}

      {licensesCertifications?.length > 0 ? (
        renderLicensesAndCertificationsSection('license')
      ) : (
        <ProfileSettingCard
          title={profile.licenses.title} // 'Licenses And Certifications'
          description={profile.licenses.noDataTips} // 'Stand out among the rest by sharing that expertise that you have earned to show your passion for the job.'
          buttonText={profile.licenses.addLicense} // 'Add licenses & cert'
          // eslint-disable-next-line
          onClick={() => handleLicenseAndCertificationsModal()}
        />
      )}

      {websites?.length > 0 ? (
        renderLinkSection('links')
      ) : (
        <ProfileSettingCard
          title={profile.link.title} // 'Links'
          description={profile.link.noDataTips} // 'Show recruiters your work by sharing your websites, portfolio, articles, or any relevant links.'
          buttonText={profile.link.addLink} // 'Add links'
          // eslint-disable-next-line
          onClick={() => handleLinksModal()}
        />
      )}
    </React.Fragment>
  )
}

const RenderPreferencesView = ({ modalName, config, userDetail, preference, lang }: any) => {
  // const [openToWork, setOpenToWork] = useState(true)
  const {
    manageProfile: {
      tab: { preference: transitions }
    }
  } = lang
  const minSalary = preference?.salary_range_from
  const maxSalary = preference?.salary_range_to
  const salaryRange = minSalary + ' - ' + maxSalary
  const [showModal, setShowModal] = useState(false)
  const currencyList = getCurrencyList(config)
  const handleEditClick = () => {
    setShowModal(true)
  }
  const [showDelete, setShowDelete] = useState(false)
  return (
    <React.Fragment>
      <div className={styles.jobPreferencesSectionDetail}>
        <div style={{ right: 40 }} className={styles.iconWrapperP} onClick={handleEditClick}>
          <img src={PencilIcon} width='22' height='22' />
        </div>
        <div
          style={{ right: 0 }}
          className={styles.iconWrapperP}
          onClick={() => setShowDelete(true)}
        >
          <img src={AccountSettingDeleteIconBin} width='14' height='14' />
        </div>
        <div className={styles.jobPreferencesSectionDetailList}>
          {preference?.job_title && (
            <div
              className={styles.jobPreferencesSectionDetailListWrapper}
              style={{ marginTop: '8px' }}
            >
              <Text textColor='lightgrey' className={styles.jobPreferencesSectionDetailTitle}>
                {transitions.card.title}
              </Text>
              <Text className={styles.jobPreferencesSectionDetailText}>{preference.job_title}</Text>
            </div>
          )}
          {preference?.job_type && (
            <div className={styles.jobPreferencesSectionDetailListWrapper}>
              <Text textColor='lightgrey' className={styles.jobPreferencesSectionDetailTitle}>
                {/* Desired job type: */}
                {transitions.card.type}
              </Text>
              <Text className={styles.jobPreferencesSectionDetailText}>{preference.job_type}</Text>
            </div>
          )}
          {preference?.country && (
            <div className={styles.jobPreferencesSectionDetailListWrapper}>
              <Text textColor='lightgrey' className={styles.jobPreferencesSectionDetailTitle}>
                {/* Desired country: */}
                {transitions.card.country}
              </Text>
              <Text className={styles.jobPreferencesSectionDetailText}>{preference.country}</Text>
            </div>
          )}
          {preference?.location && (
            <div className={styles.jobPreferencesSectionDetailListWrapper}>
              <Text textColor='lightgrey' className={styles.jobPreferencesSectionDetailTitle}>
                {/* Desired city: */}
                {transitions.card.city}
              </Text>
              <Text className={styles.jobPreferencesSectionDetailText}>{preference.location}</Text>
            </div>
          )}
          {preference?.salary_range_from && (
            <div className={styles.jobPreferencesSectionDetailListWrapper}>
              <Text textColor='lightgrey' className={styles.jobPreferencesSectionDetailTitle}>
                {/* Expected salary: */}
                {transitions.card.salary}
              </Text>
              <Text className={styles.jobPreferencesSectionDetailText}>
                {formatSalaryRange(
                  salaryRange,
                  currencyList?.find((item) => preference.currency_id === item.id)?.display_symbol
                )}
              </Text>
            </div>
          )}
          {preference?.industry && (
            <div className={styles.jobPreferencesSectionDetailListWrapper}>
              <Text textColor='lightgrey' className={styles.jobPreferencesSectionDetailTitle}>
                {/* Desired industry: */}
                {transitions.card.industry}
              </Text>
              <Text className={styles.jobPreferencesSectionDetailText}>{preference.industry}</Text>
            </div>
          )}

          {/* {workingSetting && (
                  <div>
                      <Text textColor='lightgrey'>Desire working setting:</Text>
                      <Text>{workingSetting}</Text>
                  </div>
                )} */}
          {/* {userDetail?.notice_period_id && (
                  <div className={styles.jobPreferencesSectionDetailListWrapper}>
                    <Text textColor='lightgrey' className={styles.jobPreferencesSectionDetailTitle}>
                      Availability:
                    </Text>
                    <Text className={styles.jobPreferencesSectionDetailText}>
                      {getAvailability(userDetail)}
                    </Text>
                  </div>
                )} */}
        </div>

        <EditJobPreferencesModal
          lang={lang}
          modalName={modalName}
          showModal={showModal}
          config={config}
          userDetail={userDetail}
          preference={preference}
          handleModal={() => setShowModal(false)}
        />
        <EditJobPreferencesDeleteModal
          lang={lang}
          modalName={modalName}
          showModal={showDelete}
          config={config}
          userDetail={userDetail}
          preference={preference}
          handleModal={() => setShowDelete(false)}
        />
      </div>
    </React.Fragment>
  )
}

const ManageProfilePage = ({ lang }: any) => {
  const router = useRouter()
  const {
    query: { tab }
  } = router
  const {
    manageProfile: { tab: tabDic }
  } = lang
  const { preference } = tabDic
  const [tabValue, setTabValue] = useState<string | string[]>(tab || 'profile')
  const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail.response)
  const config = useSelector((store: any) => store?.config?.config?.response)
  useMemo(() => {
    changeUserInfoValue(userDetail, config)
    changeJobPreference(userDetail.job_preferences || [], config)
    return userDetail
  }, [userDetail, config])
  // const dispatch = useDispatch()
  // // useEffect(() => {
  // //   dispatch(fetchConfigRequest())
  // // }, [])
  const [openToWork, setOpenToWork] = useState(userDetail?.is_visible)
  const jobCategoryList = getJobCategoryList(config).map((category) => {
    return {
      label: category.value,
      value: category.id
    }
  })
  const jobData = useMemo(() => {
    return [userDetail?.job_preferences || [], Date.now()]
  }, [userDetail?.job_preferences])
  const availability = userDetail?.notice_period
  const [modalState, setModalState] = useState({
    profile: {
      showModal: false,
      data: null
    },
    workExperience: {
      showModal: false,
      data: null
    },
    education: {
      showModal: false,
      data: null
    },
    skills: {
      showModal: false,
      data: null
    },
    links: {
      showModal: false,
      data: null
    },
    license: {
      showModal: false,
      data: null
    },
    jobPreferencesAvailibility: {
      showModal: false,
      data: null
    },
    createJobPreference: {
      showModal: false,
      data: null
    }
  })

  useEffect(() => {
    // if (disableScrolling){
    //  disable body from scrolling when modal is open
    const body = document.querySelector('body')
    const anyModalIsOpen = Object.values(modalState).filter((state) => state.showModal)
    body.style.overflow = anyModalIsOpen.length > 0 ? 'hidden' : 'auto'
  }, [modalState])
  const handleVisibility = () => {
    setOpenToWork(!openToWork)
    updateUserVisibilityToWorkService({
      is_visible: !openToWork
    })
  }
  const handleModal = (modalName, showModal, data, callbackFunc) => {
    setModalState((rest) => ({
      ...rest,
      [modalName]: {
        showModal: showModal,
        data: data
      }
    }))
    if (callbackFunc) {
      callbackFunc()
    }
  }

  return (
    <Layout lang={lang}>
      <EditProfileModal
        lang={lang}
        modalName='profile'
        showModal={modalState.profile.showModal}
        config={config}
        userDetail={userDetail}
        handleModal={handleModal}
      />
      <EditJobPreferencesModal
        lang={lang}
        modalName='createJobPreference'
        showModal={modalState.createJobPreference.showModal}
        config={config}
        userDetail={userDetail}
        handleModal={handleModal}
      />
      <EditWorkExperienceModal
        lang={lang}
        modalName='workExperience'
        showModal={modalState.workExperience.showModal}
        data={modalState.workExperience.data}
        config={config}
        handleModal={handleModal}
      />
      <EditEducationModal
        lang={lang}
        modalName='education'
        showModal={modalState.education.showModal}
        education={modalState.education.data}
        config={config}
        handleModal={handleModal}
      />
      <EditJobPreferencesAvailabilityModal
        modalName='jobPreferencesAvailibility'
        showModal={modalState.jobPreferencesAvailibility.showModal}
        config={config}
        userDetail={userDetail}
        handleModal={handleModal}
      />
      <EditSkillModal
        lang={lang}
        modalName='skills'
        showModal={modalState.skills.showModal}
        categoryList={jobCategoryList}
        skills={userDetail.skills}
        handleModal={handleModal}
      />
      <EditLicensesAndCertificationsModal
        lang={lang}
        modalName='license'
        showModal={modalState.license.showModal}
        licenseData={modalState.license.data}
        handleModal={handleModal}
      />
      <EditLinkModal
        lang={lang}
        modalName='links'
        showModal={modalState.links.showModal}
        linkData={modalState.links.data}
        handleModal={handleModal}
      />
      <ProfileLayout
        dic={tabDic}
        userDetail={userDetail}
        tabValue={tabValue}
        setTabValue={setTabValue}
        modalName='profile'
        handleModal={handleModal}
      >
        {tabValue === 'profile' && (
          <RenderProfileView
            lang={lang}
            userDetail={userDetail}
            handleModal={handleModal}
            config={config}
          />
        )}
        {tabValue === 'job-preferences' && (
          <div>
            <div className={styles.sectionContainer} style={{ paddingBottom: 0 }}>
              <div className={styles.sectionHeader}>
                <Text bold textColor='primaryBlue' textStyle='xl'>
                  {preference.available}
                </Text>
              </div>
              <div style={{ position: 'relative', width: '100%' }}>
                <div
                  className={styles.iconWrapperP}
                  onClick={() => handleModal('jobPreferencesAvailibility', true, null, null)}
                >
                  <img src={PencilIcon} width='22' height='22' />
                </div>
                <Text tagName='p' textStyle='lg'>
                  {availability}
                </Text>
              </div>
            </div>
            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeader} style={{ position: 'relative', width: '100%' }}>
                {jobData[0]?.length < 3 && (
                  <div
                    className={styles.iconWrapperP}
                    onClick={() => handleModal('createJobPreference', true, null, null)}
                  >
                    <Image src={AddIcon} width='14' height='14' color='#337f43' alt={''} />
                  </div>
                )}

                <Text bold textColor='primaryBlue' textStyle='xl'>
                  {preference.card.header}
                </Text>
              </div>
              <div>
                <Text tagName='p' textStyle='lg'>
                  {preference.card.tips}
                  {/* We will find jobs that are of a good match to you based on your job preferences. */}
                </Text>
              </div>{' '}
              <Fragment key={jobData[1]}>
                {(jobData[0] ?? []).map((preference) => (
                  <RenderPreferencesView
                    lang={lang}
                    key={preference.id}
                    modalName='jobPreferences'
                    config={config}
                    userDetail={userDetail}
                    handleModal={handleModal}
                    preference={preference}
                  />
                ))}
              </Fragment>
            </div>
            <div className={styles.sectionContainer}>
              <Text
                className={styles.openToWorkSectionTitle}
                bold
                textStyle='xl'
                textColor='primaryBlue'
              >
                {preference.openToWork.title}
              </Text>
              <FormControlLabel
                control={<Switch checked={openToWork} onChange={handleVisibility} />}
                label={<Text textStyle='lg'>{preference.openToWork.explain}</Text>}
              />
            </div>
          </div>
        )}
        {tabValue === 'resume' && <ResumeView userDetail={userDetail} lang={lang} />}
      </ProfileLayout>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, query }) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return {
      redirect: {
        destination: '/get-started?redirect=/manage-profile',
        permanent: false
      }
    }
  }
  const lang = await getDictionary(query.lang as 'en-US')
  store.dispatch(fetchConfigRequest(query.lang))
  store.dispatch(fetchUserOwnDetailRequest({ accessToken }))
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  // const storeState = store.getState()
  // const config = storeState.config.config.response

  return {
    props: {
      // config,
      accessToken,
      lang
    }
  }
})

export default ManageProfilePage
