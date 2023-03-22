'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from 'app/components/MUIs/'

type propsType = {
  jobDetail: any
}

const SeeMore = ({ jobDetail }: propsType) => {
  useEffect(() => {
    console.log(jobDetail, '===========jobdetailjobdetailjobdetail')
  }, [jobDetail])

  const router = useRouter()
  const handleToHomePage = () => {
    router.push('/jobs-hiring/job-search')
  }

  return (
    <Button
      variant='outlined'
      sx={{
        height: '44px',
        width: '100%',
        marginTop: '20px',
        borderRadius: '10px',
        border: '2px solid #136FD3',
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '14px',
        lineHeight: '18px',
        letterSpacing: '0.0075em',
        color: '#136FD3',
        textTransform: 'capitalize'
      }}
      onClick={handleToHomePage}
    >
      See more
    </Button>
  )
}

export default SeeMore
