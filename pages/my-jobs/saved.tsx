/* Components */
import MyJobs from 'components/MyJobs'

const Saved = (props: any) => {
  const { accessToken } = props
  
  return (
    <MyJobs category='saved' accessToken={accessToken}/>
  )
}

export async function getServerSideProps({ req }) {
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return { 
      redirect: { 
        destination: '/login?redirect=/my-jobs/saved?page=1&size=10', 
        permanent: false, 
      }
    }
  }
  return {
    props: {
      accessToken
    },
  }
}

export default Saved