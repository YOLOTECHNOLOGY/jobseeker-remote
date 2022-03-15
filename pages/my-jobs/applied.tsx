/* Components */
import MyJobs from 'components/MyJobs'

const Applied = (props: any) => {
  const { accessToken } = props
  
  return (
    <MyJobs category='applied' accessToken={accessToken}/>
  )
}

export async function getServerSideProps({ req }) {
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
    return { 
      redirect: { 
        destination: '/login?redirect=/my-jobs/applied?page=1&size=10', 
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

export default Applied