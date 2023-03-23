'use client'
import { useRouter } from 'next/navigation'
import { toPairs } from 'ramda'

import { Button } from 'app/components/MUIs/'
import { encode } from 'app/job-search/interpreters/encoder'

import styles from '../../../../page.module.scss'

type propsType = {
  jobDetail: any
}

const SeeMore = ({ jobDetail }: propsType) => {
  const router = useRouter()

  const handleToHomePage = () => {
    const searchQuery: any = {
      location: [jobDetail.location.value],
      mainFunctions: [jobDetail.function?.main_function],
      jobFunctions: [jobDetail.function?.sub_function],
      workExperience: [jobDetail.xp_lvl?.key]
    }
    const result = encode(searchQuery)
    const url = new URLSearchParams(toPairs(result.params)).toString()
    router.push('/job-search/' + result.searchQuery + '?' + url, {
      forceOptimisticNavigation: true
    })
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
      className={styles.similarJobs_seeMore}
      onClick={handleToHomePage}
    >
      See more
    </Button>
  )
}

export default SeeMore
