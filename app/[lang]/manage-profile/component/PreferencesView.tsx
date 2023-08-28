import React, { useState, useEffect, useMemo, Fragment } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'


/* Components */
import Text from 'components/Text'
import EditJobPreferencesDeleteModal from 'components/EditJobPreferencesDeleteModal'
import EditProfileModal from 'components/EditProfileModal'
import EditJobPreferencesModal from 'components/EditJobPreferencesModal'


/* Helpers */
import { formatSalaryRange } from 'helpers/formatter'
import { getCookie } from 'helpers/cookies'

moment.locale('en')

/* Assets */
import {
  AddIcon,
  PencilIcon,
  TrashIcon2,
  AccountSettingDeleteIconBin
} from 'images'

/* Styles */
import styles from './ManageProfile.module.scss'
import { FormControlLabel, Switch } from '@mui/material'
import { getCurrencyList } from 'helpers/jobPayloadFormatter'
import EditJobPreferencesAvailabilityModal from 'components/EditJobPreferencesAvailabilityModal/EditJobPreferencesAvailabilityModal'
import { updateUserVisibilityToWorkService } from 'store/services/jobs/updateUserVisibilityToWork'
import Image from 'next/image'
import {
  changeJobPreference,
  changeUserInfoValue
} from 'helpers/config/changeUserInfoValue'
import { getValueById } from 'helpers/config/getValueById'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'


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

        {userDetail?.job_preferences?.length > 1 ? (
          <div
            style={{ right: '12px' }}
            className={styles.iconWrapperP}
          >
            <img src={PencilIcon} width='22' height='22' onClick={handleEditClick} />
            &nbsp;&nbsp;
            <img src={AccountSettingDeleteIconBin} width='14' height='14' onClick={() => setShowDelete(true)} />
          </div>
        ) : <div className={styles.iconWrapperP} onClick={handleEditClick}>
          <img src={PencilIcon} width='22' height='22' />
        </div>}

        <div className={styles.jobPreferencesSectionDetailList}>
          {preference?.job_title && (
            <div
              className={styles.jobPreferencesSectionDetailListWrapper}
              style={{ marginTop: '8px' }}
            >
              <Text textColor='lightgrey' className={styles.jobPreferencesSectionDetailTitle} >
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
                {transitions.card?.industry}
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

const PreferencesView = ({ lang }: any) => {
  const {
    manageProfile: { tab: tabDic }
  } = lang
  const { preference } = tabDic
  const dispatch = useDispatch()
  const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail.response)
  const config = useSelector((store: any) => store?.config?.config?.response)
  const accessToken = getCookie('accessToken')

  useEffect(() => {
    console.log('userDetail:', userDetail)
  }, [userDetail])
  useMemo(() => {
    changeUserInfoValue(userDetail, config)
    changeJobPreference(userDetail.job_preferences || [], config)
    return userDetail
  }, [userDetail, config])


  const [unCompleted, setUnCompleted] = useState({
    profile: false,
    'job-preferences': false,
    resume: false
  })
  // const dispatch = useDispatch()
  // // useEffect(() => {
  // //   dispatch(fetchConfigRequest())
  // // }, [])

  useEffect(() => {
    if (userDetail?.job_preferences) {
      setUnCompleted((prev) => ({
        ...prev,
        'job-preferences': userDetail?.job_preferences?.length == 0
      }))
    }
    if (userDetail?.resumes) {
      setUnCompleted((prev) => ({ ...prev, resume: userDetail?.resume?.length == 0 }))
    }
  }, [userDetail])

  const [openToWork, setOpenToWork] = useState(userDetail?.is_visible)
  // const jobCategoryList = getJobCategoryList(config).map((category) => {
  // return {
  // label: category.value,
  // value: category.id
  // }
  // })
  const jobData = useMemo(() => {
    return [userDetail?.job_preferences || [], Date.now()]
  }, [userDetail?.job_preferences])
  const availability = getValueById(config, userDetail?.notice_period_id, 'notice_period_id')

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

  const handleVisibility = async () => {
    setOpenToWork(!openToWork)
    try {
      await updateUserVisibilityToWorkService({
        is_visible: !openToWork
      })
      dispatch(fetchUserOwnDetailRequest({ accessToken }))
    } catch (err) {
      Promise.resolve(err)
    }

  }
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

  return (
    <Fragment>
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
      <EditJobPreferencesAvailabilityModal
        modalName='jobPreferencesAvailibility'
        showModal={modalState.jobPreferencesAvailibility.showModal}
        config={config}
        userDetail={userDetail}
        handleModal={handleModal}
        lang={lang}
      />

      <div className={styles.sectionContainer}>
        <div className={styles.sectionContainerInner}>
          <div className={styles.sectionHeader}>
            <Text
              className={styles.openToWorkSectionTitle}
              bold
              textStyle='xl'
              textColor='primaryBlue'
              style={{ marginBottom: '15px', fontSize: '24px' }}
            >
              {preference.openToWork.title}
            </Text>
          </div>

          <FormControlLabel
            control={<Switch checked={openToWork} onChange={handleVisibility} />}
            label={<Text textStyle='lg'>{preference.openToWork.explain}</Text>}
          />
        </div>
      </div>
      <div className={styles.sectionContainer} style={{ paddingBottom: 0 }}>
        <div className={styles.sectionContainerInner} style={{ paddingBottom: 0 }}>
          <div className={styles.sectionHeader}>
            <Text bold textColor='primaryBlue' textStyle='xl' style={{ marginBottom: '15px', fontSize: '24px' }}>
              {preference.available}
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', width: '100%', height: '65px' }}>
            <Text tagName='p' textStyle='lg' style={{ marginBottom: 0, marginTop: 0 }}>
              {availability}
            </Text>
            <div
              className={styles.iconWrapperP}
              onClick={() => handleModal('jobPreferencesAvailibility', true, null, null)}
              style={{ position: 'static', marginRight: 0 }}
            >
              <img src={PencilIcon} width='22' height='22' />
            </div>

          </div>
        </div>

      </div>
      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeader} style={{ position: 'relative', width: '100%' }}>
          {jobData[0]?.length < 3 && (
            <div
              className={styles.iconWrapperP}
              onClick={() => handleModal('createJobPreference', true, null, null)}
            >
              <Image src={AddIcon} width='26' height='26' color='#337f43' alt={''} />
            </div>
          )}

          <Text bold textColor='primaryBlue' textStyle='xl' style={{ marginBottom: '15px', fontSize: '24px' }}>
            {preference.card.header}
          </Text>
        </div>
        <div>
          <Text tagName='p' textStyle='lg'>
            {preference.card.tips}
          </Text>
        </div>{' '}
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
      </div>
    </Fragment >
  )
}


export default PreferencesView
