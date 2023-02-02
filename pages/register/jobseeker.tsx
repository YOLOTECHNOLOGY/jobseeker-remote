import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Jobseeker = () => {
  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      router.push('/get-started')
    })
  }, [])
  return <div></div>
}

export default Jobseeker
