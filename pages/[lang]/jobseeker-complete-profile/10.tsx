import React from 'react'
// @ts-ignore
import { END } from 'redux-saga'
/* Redux Actions */
import { wrapper } from 'store'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
// Components
import useUploadResume from '../../../hooks/useUploadResume'
// Styles
import OnRegisterUpload from '../../../components/JobseekerCompleteProfile/OnRegisterUpload'
import { getDictionary } from 'get-dictionary'
const Step2 = (props: any) => {
  const hookProps = useUploadResume(props)
  return <OnRegisterUpload {...hookProps} />
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req,query }) => {
  const accessToken = req.cookies.accessToken
  const lang = await getDictionary(query.lang as 'en')
  if (!accessToken) {
    return {
      redirect: {
        destination: '/get-started?redirect=/jobseeker-complete-profile/10',
        permanent: false,
        lang
      }
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
      lang
    }
  }
})

export default Step2
