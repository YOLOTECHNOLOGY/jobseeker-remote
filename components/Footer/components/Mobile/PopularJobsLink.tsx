import React from 'react'
import styles from '../../Footer.module.scss'
import Text from 'components/Text'
import Accordian from 'components/Accordian'
import PopularList from '../common/PopularList'

const PopularJobsLink = (props: any) => {
  const { data } = props

  const { popularJobs } =
    data?.foot || {}

  return (
    <Accordian
      paddedLine
      paddedContent
      dark={true}
      title={
        <Text textStyle='sm' className={styles.footerMobileLinkTitle}>
          {popularJobs}
        </Text>
      }
    >
      <PopularList data={data} />
    </Accordian>
  )
}

export default PopularJobsLink
