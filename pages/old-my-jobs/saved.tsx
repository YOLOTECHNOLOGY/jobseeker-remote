import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
/* Action Creators */
import { wrapper } from 'store'

/* Components */
import MyJobs from 'components/MyJobs'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { titleCase } from 'helpers/formatter'

const Saved = (props: any) => {
  const { accessToken } = props
  const config = useSelector((store: any) => store?.config?.config?.response)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchConfigRequest())
  }, [])
  return <MyJobs category='saved' config={config} accessToken={accessToken} />
}

export const getServerSideProps = wrapper.getServerSideProps(() => async ({ req }) => {
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return {
      redirect: {
        destination: '/get-started?redirect=/old-my-jobs/saved?page=1&size=10',
        permanent: false
      }
    }
  }
  const seoMetaTitle = `${titleCase('saved')} Jobs - Career Platform for Professionals in Philippines`
  const seoMetaDescription = 'Bossjob - Career Platform for Professionals in Philippines'
  return {
    props: {
      accessToken,
      seoMetaTitle,
      seoMetaDescription,
    }
  }
})

export default Saved
