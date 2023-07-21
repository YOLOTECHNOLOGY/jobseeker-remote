import React, { useState, useEffect, useCallback, useMemo, useRef, Fragment } from 'react'

/* Vendors */

import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

/* Redux actions */
import { manageUserWorkExperiencesRequest } from 'store/actions/users/manageUserWorkExperiences'
import { manageUserEducationsRequest } from 'store/actions/users/manageUserEducations'
import { manageUserLicensesAndCertificationsRequest } from 'store/actions/users/manageUserLicensesAndCertifications'
import { manageUserLinksRequest } from 'store/actions/users/manageUserLinks'

/* Components */
import Modal from 'components/Modal'
import Text from 'components/Text'
import ProfileSettingCard from 'components/ProfileSettingCard'
import ReadMore from 'components/ReadMore'
import Link from 'components/Link'
import EditWorkExperienceModal from 'components/EditWorkExperienceModal'
import EditEducationModal from 'components/EditEducationModal'
import EditLicensesAndCertificationsModal from 'components/EditLicenseAndCertificationsModal'
import EditLinkModal from 'components/EditLinkModal'
import EditIntroductionModal from 'components/EditIntroductionModal/EditIntroductionModal'

/* Helpers */
import useWindowDimensions from 'helpers/useWindowDimensions'
import { formatSalary, getYearMonthDiffBetweenDates } from 'helpers/formatter'
moment.locale('en')

/* Assets */
import {
  AddIcon,
  PencilIcon,
  TrashIcon,
} from 'images'

/* Styles */
import styles from './ManageProfile.module.scss'
import { Chip } from '@mui/material'
import EditSkillModal from 'components/EditSkillModal'
import { getCurrencyList, getJobCategoryList } from 'helpers/jobPayloadFormatter'

import {
  changeCompanyIndustry,
  changeUserInfoValue
} from 'helpers/config/changeUserInfoValue'
import { getValueById } from 'helpers/config/getValueById'


const ProfileView = ({ lang }: any) => {
  const {
    manageProfile: {
      tab: { profile }
    }
  } = lang
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const isMobile = width < 768 ? true : false

  const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail.response)
  const isUpdating = useSelector((store: any) => store.users.fetchUserOwnDetail.fetching)
  console.log('isUpdating:', userDetail)
  const config = useSelector((store: any) => store?.config?.config?.response)
  const {
    // first_name: firstName,
    // last_name: lastName,
    // birthdate,
    // location,
    // xp_lvl: expLevel,
    // description,
    work_experiences: workExperiences,
    educations,
    skills,
    license_certifications: licensesCertifications,
    websites,
    description

  } = userDetail

  const deleteModalRef = useRef({} as any)

  useMemo(() => {
    changeUserInfoValue(userDetail, config)
    return userDetail
  }, [userDetail, config])

  useMemo(() => {
    changeCompanyIndustry(workExperiences, config)
  }, [workExperiences])

  const handleModal = (modalName, showModal, data, callbackFunc) => {
    // ======...TODO
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
    },
    deleteConfirm: {
      showModal: false,
      data: null
    },
    introduction: {
      showModal: false,
      data: null
    }
  })

  const { currency_lists } = config
  // const isProfileInformationFilled = !!(
  //   firstName &&
  //   lastName &&
  //   birthdate &&
  //   location &&
  //   expLevel &&
  //   description
  // )

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

  // const [openToWork, setOpenToWork] = useState(userDetail?.is_visible)
  const jobCategoryList = getJobCategoryList(config).map((category) => {
    return {
      label: category.value,
      value: category.id
    }
  })


  useEffect(() => {
    let count = 0
    if (workExperiences?.length === 0) {
      count += 1
    }
    if (educations?.length === 0) {
      count += 1
    }
    if (skills?.length === 0) {
      count += 1
    }

    if (!validProfileInformationFilled(userDetail)) {
      count += 1
    }
  }, [userDetail])

  const handleAddData = (type) => {
    switch (type) {
      case 'workExperience':
        handleModal(type, true, null, null)
      case 'education':
        handleModal(type, true, null, null)
      case 'license':
        handleModal(type, true, null, null)
      case 'links':
        handleModal(type, true, null, null)
      default:
        break
    }
  }

  const handleEditData = (type, data) => {
    switch (type) {
      case 'workExperience':
        handleModal(type, true, data, null)
      case 'education':
        handleModal(type, true, data, null)
      case 'license':
        handleModal(type, true, data, null)
      case 'links':
        handleModal(type, true, data, null)
      case 'introduction':
        handleModal(type, true, data, null)
      default:
        break
    }
  }
  const handleDeleteData = (modalType, type, data, id) => {
    deleteModalRef.current = {
      type,
      id
    }
    handleModal(modalType, true, data, null)
  }

  const handleWorkExpModal = (workExp = null) => {
    handleModal('workExperience', true, workExp, null)
  }

  const handleEducationModal = (education = null) => {
    handleModal('education', true, education, null)
  }

  const handleLicenseAndCertificationsModal = (license = null) => {
    handleModal('license', true, license, null)
  }

  const handleLinksModal = (link = null) => {
    handleModal('links', true, link, null)
  }

  const getEducationLang = (eduction: any) => {
    if (!eduction.degree_id) return eduction.degree
    return getValueById(config, eduction.degree_id, 'degree_id')
  }


  const handleDeleteDataConfirm = () => {
    const { type, id } = deleteModalRef.current

    switch (type) {
      case 'workExperience':
        dispatch(
          manageUserWorkExperiencesRequest({
            isDelete: true,
            workExperienceId: id
          })
        )
        break;
      case 'education':
        dispatch(
          manageUserEducationsRequest({
            isDelete: true,
            educationId: id
          })
        )
        break;
      case 'license':
        dispatch(
          manageUserLicensesAndCertificationsRequest({
            isDelete: true,
            licenseId: id
          })
        )
        break;
      case 'links':
        dispatch(
          manageUserLinksRequest({
            isDelete: true,
            linkId: id
          })
        )
        break;
      default:
        break
    }
  }

  const renderIntroduction = () => {
    return (
      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <Text textStyle='xl' textColor='primaryBlue' bold style={{ fontSize: '24px' }}>
            {profile.introduction}
          </Text>
          {/* <div className={styles.iconWrapper} onClick={() => handleAddData(sectionName)}>
            <img src={AddIcon} width='14' height='14' />
          </div> */}
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.educationSection}>
            <div className={styles.titleWrapper}>
              <Text textStyle='lg' bold style={{ fontSize: '20px' }}>
                {description ?
                  <ReadMore
                    expandText={profile.readMore}
                    shirkText={profile.readLess}
                    size={isMobile ? 210 : 300}
                    text={description}
                    className={styles.readMoreDescriptionWrapper}
                  /> :
                  <ReadMore className={styles.readMoreDescriptionWrapper} text={profile.introductionEmpty} />}
              </Text>
              <div className={styles.iconWrapperDouble}>
                <div
                  className={styles.iconWrapper}
                  onClick={() => handleModal('introduction', true, null, null)}
                >
                  <img src={PencilIcon} width='22' height='22' />
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

    )
  }


  const renderWorkExperienceSection = (sectionName) => {
    return (
      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <Text textStyle='xl' textColor='primaryBlue' bold style={{ fontSize: '24px' }}>
            {/* Work Experience */}
            {profile.exp.title}
          </Text>
          <div className={styles.iconWrapper} onClick={() => handleAddData(sectionName)}>
            <img src={AddIcon} width='14' height='14' />
          </div>
        </div>
        <div className={styles.sectionContent}>
          {workExperiences.map((workExp) => {
            const { currency_id, function_job_title_id } = workExp
            const currencySymbol = currency_lists?.find(
              ({ id }) => currency_id === id
            )?.display_symbol
            const function_job_title = getValueById(
              config,
              function_job_title_id,
              'function_job_title_id'
            )
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
                  <Text textStyle='lg' bold style={{ fontSize: '20px' }}>
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
                      className={
                        styles.iconWrapper +
                        ' ' +
                        (workExperiences?.length > 1 ? '' : styles.disabledOpacity)
                      }
                      onClick={() => {
                        if (workExperiences?.length > 1) {
                          handleDeleteData('deleteConfirm', sectionName, workExp, workExp.id)
                        }
                      }}
                    >
                      <img src={TrashIcon} width='14' height='14' />
                    </div>
                  </div>
                </div>
                <div className={styles.companyInfoWrapper}>
                  <Text textStyle='lg'>
                    {workExp.company}{' '}
                    {getValueById(config, workExp.country_id, 'country_id') ? (
                      <span style={{ color: '#bcbcbc', padding: '0 8px' }}>|</span>
                    ) : null}
                  </Text>

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
                  {dateDiff
                    ? `(${dateDiff
                      .replace('years', profile.exp.year)
                      .replace('year', profile.exp.year)
                      .replace('months', profile.exp.months)
                      .replace('month', profile.exp.month)})`
                    : ''}
                </Text>
                <div className={styles.companySecondaryInfoWrapper}>
                  {function_job_title && (
                    <Text textStyle='base' textColor='darkgrey'>
                      {function_job_title}
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
                    expandText={profile.readMore}
                    shirkText={profile.readLess}
                    size={isMobile ? 210 : 300}
                    text={workExp?.description_html}
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
          <Text textStyle='xl' textColor='primaryBlue' bold style={{ fontSize: '24px' }}>
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
                  <Text textStyle='lg' bold style={{ fontSize: '20px' }}>
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
                      className={
                        styles.iconWrapper +
                        ' ' +
                        (educations?.length > 1 ? '' : styles.disabledOpacity)
                      }
                      onClick={() => {
                        if (educations?.length > 1) {
                          handleDeleteData('deleteConfirm', sectionName, education, education.id)
                        }
                      }}
                    >
                      <img src={TrashIcon} width='14' height='14' />
                    </div>
                  </div>
                </div>
                {education?.degree && education?.field_of_study ? (
                  <Text textStyle='lg'>
                    {getEducationLang(education)} in {education.field_of_study}
                  </Text>
                ) : education?.degree ? (
                  <Text textStyle='lg'>{getEducationLang(education)} </Text>
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
          <Text textStyle='xl' textColor='primaryBlue' bold style={{ fontSize: '24px' }}>
            {profile.skill.title}
          </Text>
          <div className={styles.iconWrapper} onClick={() => handleModal('skills', true, null, null)}>
            <img src={AddIcon} width='14' height='14' />
          </div>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.skill}>
            {
              skills.map((skill, i) => <Chip
                key={i}
                className={styles.skillChip}
                label={skill}
              // variant='filled'
              // color='info'
              // size='small'
              />)
            }

            {/* <SeeMore
              count={null}
              items={skills}
              renderElement={(i, skill) => (
                <Chip
                  key={i}
                  className={styles.skillChip}
                  label={skill}
                // variant='filled'
                // color='info'
                // size='small'
                />
              )}
            /> */}
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
          <Text textStyle='xl' textColor='primaryBlue' bold style={{ fontSize: '24px' }}>
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
                      <Text textStyle='lg' bold style={{ fontSize: '20px' }}>
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
                      onClick={() => handleDeleteData('deleteConfirm', sectionName, link, link.id)}
                    >
                      <img src={TrashIcon} width='14' height='14' />
                    </div>
                  </div>
                </div>
                {link?.description && (
                  <ReadMore
                    expandText={profile.readMore}
                    shirkText={profile.readLess}
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
          <Text textStyle='xl' textColor='primaryBlue' bold style={{ fontSize: '24px' }}>
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
                  <Text textStyle='lg' bold style={{ fontSize: '20px' }}>
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
                      onClick={() => handleDeleteData('deleteConfirm', sectionName, licenseCertification, licenseCertification.id)}
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

  useEffect(() => {
    if (!isUpdating) {
      handleModal('deleteConfirm', false, null, null)
    }
  }, [isUpdating])


  return (
    <Fragment>
      {renderIntroduction()}
      {workExperiences?.length > 0 ? (
        renderWorkExperienceSection('workExperience')
      ) : (
        <ProfileSettingCard
          title={profile.exp.title} // 'Work Experience'
          description={profile.exp.noDataTips} // 'Showcase your past contributions and that you can be an asset to potential employer.'
          // buttonText={profile.exp.addWorkExp} // 'Add work experience'
          // eslint-disable-next-line
          onClick={handleWorkExpModal}
        />
      )}

      {educations?.length > 0 ? (
        renderEducationSection('education')
      ) : (
        <ProfileSettingCard
          title={profile.edu.title} // 'Education'
          description={profile.edu.noDataTips} // 'Highlight your academic qualifications and achievements.'
          // buttonText={profile.edu.addEdu} // 'Add education'
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
          // buttonText={profile.skill.addSkill} // 'Add skills'
          // eslint-disable-next-line
          onClick={() => handleModal('skills', true, null, null)}
        />
      )}

      {licensesCertifications?.length > 0 ? (
        renderLicensesAndCertificationsSection('license')
      ) : (
        <ProfileSettingCard
          title={profile.licenses.title} // 'Licenses And Certifications'
          description={profile.licenses.noDataTips} // 'Stand out among the rest by sharing that expertise that you have earned to show your passion for the job.'
          // buttonText={profile.licenses.addLicense} // 'Add licenses & cert'
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
          // buttonText={profile.link.addLink} // 'Add links'
          // eslint-disable-next-line
          onClick={() => handleLinksModal()}
        />
      )}
      {/* <EditProfileModal
        lang={lang}
        modalName='profile'
        showModal={modalState.profile.showModal}
        config={config}
        userDetail={userDetail}
        handleModal={handleModal}
      /> */}

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
      <EditIntroductionModal
        modalName='introduction'
        showModal={modalState.introduction.showModal}
        config={config}
        userDetail={userDetail}
        handleModal={handleModal}
        lang={lang}
      />
      <Modal
        showModal={modalState.deleteConfirm.showModal}
        handleModal={() => {
          deleteModalRef.current = {}
          setModalState(state => ({
            ...state,
            deleteConfirm: {
              showModal: false,
              data: null
            }
          }))
        }}
        headerTitle={profile.deleteModal.title}
        firstButtonText={profile.deleteModal.btn1}
        secondButtonText={profile.deleteModal.btn2}
        isSecondButtonLoading={isUpdating}
        firstButtonIsClose
        handleFirstButton={() => {
          deleteModalRef.current = {}
          setModalState(state => ({
            ...state,
            deleteConfirm: {
              showModal: false,
              data: null
            }
          }))
        }}
        handleSecondButton={handleDeleteDataConfirm}
        fullScreen
      >
        {profile.deleteModal.tips}
      </Modal>

    </Fragment >
  )
}

export default ProfileView;