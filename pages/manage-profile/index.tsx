import { useState } from 'react'

/* Vendors */
import { END } from 'redux-saga'
import { wrapper } from 'store'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

/* Redux actions */
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'

/* Components */
import Layout from 'components/Layout'
import ProfileLayout from 'components/ProfileLayout'
import ProfileSettingCard from 'components/ProfileSettingCard'
import EditProfileModal from 'components/EditProfileModal'

// TODO: Remove this page after testing
const ManageProfilePage = ({ config }: any) => {
  const router = useRouter()
  const { query: { tab }} = router
  const [tabValue, setTabValue] = useState<string | string[]>(tab || 'profile')
  const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail.response)

  const [modalState, setModalState] = useState({
    profile: false,
    workExperience:false,
    education:false,
    skills:false,
    links:false,
    license:false,
    jobPreferences: false
  })


  const handleModal = (modalName, showModal) => {
    setModalState({
      ...modalState,
      [modalName]:showModal
    })
  }

  return (
    <Layout>
      <EditProfileModal
        modalName='profile'
        showModal={modalState.profile}
        config={config}
        userDetail={userDetail}
        handleModal={handleModal}
      />
      <ProfileLayout
        userDetail={userDetail}
        tabValue={tabValue}
        setTabValue={setTabValue}
        modalName='profile'
        handleModal={handleModal}
      >
        <ProfileSettingCard
          title='Work Experience'
          description='Showcase your past contributions and that you can be an asset to potential employer.'
          buttonText='Add work experience'
          // eslint-disable-next-line
          onClick={() => {}}
        />
        <ProfileSettingCard
          title='Education'
          description='Highlight your academic qualifications and achievements.'
          buttonText='Add education'
          // eslint-disable-next-line
          onClick={() => {}}
        />
        <ProfileSettingCard
          title='Skills'
          description='Include relevant skill and keywords to boost your chances of getting an interview.'
          buttonText='Add skills'
          // eslint-disable-next-line
          onClick={() => {}}
        />
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