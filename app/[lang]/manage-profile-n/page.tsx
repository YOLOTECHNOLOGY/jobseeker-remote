'use client';
import { useLanguage } from 'app/components/providers/languageProvider';
import React,{useState} from 'react';
import { useRouter } from 'next/router';
import { useManageProfileData } from './DataProvider';
import ProfileLayout from 'components/ProfileLayout'
import ResumeView from './components/ResumeView';
import EditProfileModal from 'components/EditProfileModal'

const ManageProfilePage = () =>{
  const lang = useLanguage();
  const {profile : userDetail, config} = useManageProfileData()
  const searchParams = new URLSearchParams(window.location.search);
	const tab = searchParams.get('tab');;
  const {
    manageProfile: { tab: tabDic }
  } = lang
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
  console.log({lang,userDetail,config,tab});
  return <>
      <EditProfileModal
        lang={lang}
        modalName='profile'
        showModal={modalState.profile.showModal}
        config={config}
        userDetail={userDetail}
        handleModal={handleModal}
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
        {/* {tabValue === 'profile' && (
          <RenderProfileView
            lang={lang}
            userDetail={userDetail}
            handleModal={handleModal}
            config={config}
          />
        )} */}
        {tabValue === 'job-preferences'}
        {tabValue === 'resume' && <ResumeView userDetail={userDetail} lang={lang} />}
      </ProfileLayout>
  </>
  
}


export default ManageProfilePage;