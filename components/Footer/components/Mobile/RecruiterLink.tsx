import React from 'react'
import styles from '../../Footer.module.scss'
import Text from 'components/Text'
import Accordian from 'components/Accordian'
import RecruiterList from '../common/RecruiterList'

const RecruiterLink = (props: any) => {
  const { data } = props

  const { recruiter } = data?.foot || {}

  return (
    <Accordian
      paddedLine
      paddedContent
      dark={true}
      title={
        <Text textStyle='sm' className={styles.footerMobileLinkTitle}>
          {recruiter}
        </Text>
      }
    >
      <RecruiterList data={data} />
    </Accordian>
  )
}

export default RecruiterLink
