import { fetchConfigRequest } from 'store/actions/config/fetchConfig'

// @ts-ignore
import { END } from 'redux-saga'

/* Action Creators */
import { wrapper } from 'store'

/* Components */
import MyJobs from 'components/MyJobs'

const Saved = (props: any) => {
  const { accessToken, config } = props
  
  return (
    <MyJobs 
      category='saved' 
      config={config}
      accessToken={accessToken}
    />
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const accessToken = req.cookies.accessToken

  store.dispatch(fetchConfigRequest())
  store.dispatch(END)

  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const config = storeState.config.config.response

  if (!accessToken) {
    return { 
      redirect: { 
        destination: '/login/jobseeker?redirect=/my-jobs/saved?page=1&size=10', 
        permanent: false, 
      }
    }
  }
  return {
    props: {
      accessToken,
      config
    },
  }
})

export default Saved