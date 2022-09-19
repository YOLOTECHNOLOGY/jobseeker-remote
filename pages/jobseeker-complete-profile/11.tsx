import { useRouter } from 'next/router'
import React from 'react'
// @ts-ignore
/* Redux Actions */
// Components
import useFakeUploadResume from '../../hooks/useFakeUploadResume'
// Styles
import OnRegisterUpload from '../../components/JobseekerCompleteProfile/OnRegisterUpload'

const Step2 = () => {
  const router = useRouter()
  const hookProps = useFakeUploadResume()
  return (
    <>
      <OnRegisterUpload {...hookProps} />
      <div onClick={() => router.push('/quick-upload-resume')}>下一个提交页面</div>
    </>
  )
}

// export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
//   const accessToken = req.cookies.accessToken
//   if (!accessToken) {
//     return {
//       redirect: {
//         destination: '/login/jobseeker?redirect=/jobseeker-complete-profile/10',
//         permanent: false
//       }
//     }
//   }

//   store.dispatch(fetchUserOwnDetailRequest({ accessToken }))
//   store.dispatch(END)
//   await (store as any).sagaTask.toPromise()
//   const storeState = store.getState()
//   const userDetail = storeState.users.fetchUserOwnDetail.response

//   return {
//     props: {
//       userDetail,
//       accessToken
//     }
//   }
// })

export default Step2
