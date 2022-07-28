import { END } from 'redux-saga'
import EditProfileModal from '../components/EditProfileModal'
import { wrapper } from '../store'
import { fetchConfigRequest } from '../store/actions/config/fetchConfig'
import { fetchUserOwnDetailRequest } from '../store/actions/users/fetchUserOwnDetail'

export default function Page({ config, userDetail, accessToken }: any) {
  return <EditProfileModal config={config} userDetail={userDetail} accessToken={accessToken} />
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
  const userDetail = storeState.users.fetchUserOwnDetail.response

  return {
    props: {
      config,
      userDetail,
      accessToken,
    },
  }
})
