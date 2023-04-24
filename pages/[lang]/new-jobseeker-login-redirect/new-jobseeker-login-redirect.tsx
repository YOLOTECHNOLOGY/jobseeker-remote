import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import { redirectToNewJobseekerRequest } from 'store/actions/users/redirectToNewJobseeker'

const newJobseekerLoginRedirect = () => {
  const dispatch = useDispatch()
  const router  = useRouter()

  useEffect(() => {
    if (router.query) {
      const {token, redirectUrl} = router.query
      if (token) dispatch(redirectToNewJobseekerRequest({token: token, redirectUrl: redirectUrl}))
      if (redirectUrl) router.push(`${redirectUrl}`)
    }
  }, [router.query])  

  return <div/>
}

export default newJobseekerLoginRedirect