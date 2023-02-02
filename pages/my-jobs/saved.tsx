import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
/* Action Creators */
import { wrapper } from 'store'

/* Components */
import MyJobs from 'components/MyJobs'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

const Saved = (props: any) => {
  const { accessToken } = props
  const config = useSelector((store: any) => store?.config?.config?.response)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchConfigRequest())
  }, [])
  return <MyJobs category='saved' config={config} accessToken={accessToken} />
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const accessToken = req.cookies.accessToken

  // store.dispatch(fetchConfigRequest())
  // store.dispatch(END)

  // await (store as any).sagaTask.toPromise()
  // const storeState = store.getState()
  // const config = storeState.config.config.response

  if (!accessToken) {
    return {
      redirect: {
        destination: '/get-started?redirect=/my-jobs/saved?page=1&size=10',
        permanent: false
      }
    }
  }
  return {
    props: {
      accessToken
      // config
    }
  }
})

export default Saved
