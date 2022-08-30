import React, { } from 'react'
// @ts-ignore
import { END } from 'redux-saga'
/* Redux Actions */
import { wrapper } from 'store'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
// Components
import useFakeUploadResume from '../hooks/useFakeUploadResume'
// Styles
import OnRegisterUpload from './components/OnRegisterUpload'

const Step2 = (props: any) => {
  const hookProps = useFakeUploadResume(props)
  return (<OnRegisterUpload {...hookProps} />)
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return {
      redirect: {
        destination: '/login/jobseeker?redirect=/jobseeker-complete-profile/10',
        permanent: false,
      },
    }
  }

  store.dispatch(fetchUserOwnDetailRequest({ accessToken }))
  store.dispatch(END)
  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const userDetail = storeState.users.fetchUserOwnDetail.response

  return {
    props: {
      userDetail,
      accessToken,
    },
  }
})

export default Step2
