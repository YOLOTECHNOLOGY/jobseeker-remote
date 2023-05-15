'use client'
import { useRouter } from 'next/navigation'
import { toPairs } from 'ramda'
import { useSelector } from 'react-redux'

import { Button } from 'app/[lang]/components/MUIs'
import { encode } from 'app/[lang]/jobs-hiring/interpreters/encoder'

import styles from '../../../../page.module.scss'

type propsType = {
  jobDetail: any
  text: string
}

const SeeMore = ({ jobDetail, text }: propsType) => {
  const router = useRouter()
  const xp_lvls = useSelector((store: any) => store.config.config.response?.xp_lvls ?? [])

  const handleToHomePage = () => {
    const xp_lvl = xp_lvls.find((item) => jobDetail.xp_lvl?.key == item.key)
    const searchQuery: any = {
      location: [jobDetail.location.value],
      mainFunctions: [jobDetail.function?.main_function],
      jobFunctions: [jobDetail.function?.sub_function]
      // workExperience: [xp_lvl['seo-value']]
    }

    if (xp_lvl?.['seo-value']) {
      searchQuery.workExperience = xp_lvl['seo-value']
    }

    const result = encode(searchQuery)
    const url = new URLSearchParams(toPairs(result.params)).toString()
    router.push('/jobs-hiring/' + result.searchQuery + '?' + url, {
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
      {text || 'See more'}
    </Button>
  )
}

export default SeeMore
