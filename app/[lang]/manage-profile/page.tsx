'use client';
import { useLanguage } from 'app/components/providers/languageProvider';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';
import { useManageProfileData } from './DataProvider';
import ProfileLayout from 'components/ProfileLayout'
import EditProfileModal from 'components/EditProfileModal'
import ResumeView from './component/ResumeView';
import ProfileView from './component/ProfileView';
import PreferencesView from './component/PreferencesView';


const ManageProfilePage = () => {
  const lang = useLanguage();
  const { profile: userDetail, config, fetchProfile } = useManageProfileData()
  const searchParams = new URLSearchParams(window.location.search);
  const tab = searchParams.get('tab');
  const {
    manageProfile: { tab: tabDic }
  } = lang
  console.log('tab',tab);
  const [tabValue, setTabValue] = useState<string | string[]>(tab || 'profile')
  const [unCompleted, setUnCompleted] = useState({
    profile: false,
    'job-preferences': false,
    resume: false
  })
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
    }
  })

  useLayoutEffect(()=>{
    if(tab !== tabValue){
      setTabValue(tab || 'profile');
    }
  },[tabValue,tab]);

  
  useEffect(() => {
    if (userDetail?.job_preferences) {
      setUnCompleted((prev) => ({
        ...prev,
        'job-preferences': userDetail?.job_preferences?.length == 0
      }))
    }
    if (userDetail?.resumes) {
      setUnCompleted((prev) => ({ ...prev, resume: userDetail?.resumes?.length == 0 }))
    }
  }, [userDetail])
  return <>

    <EditProfileModal
      lang={lang}
      modalName='profile'
      showModal={modalState.profile.showModal}
      config={config}
      userDetail={userDetail}
      handleModal={handleModal}
      fetchProfile={fetchProfile}
    />
    <ProfileLayout
      dic={tabDic}
      userDetail={userDetail}
      tabValue={tabValue}
      setTabValue={setTabValue}
      modalName='profile'
      handleModal={handleModal}
      unCompleted={unCompleted}
    >


      {tabValue === 'profile' && <ProfileView lang={lang} />}
      {tabValue === 'job-preferences' && <PreferencesView lang={lang} />}
      {tabValue === 'resume' && <ResumeView userDetail={userDetail} lang={lang} />}

    </ProfileLayout>

  </>

}


export default ManageProfilePage;