import React from 'react'
import styles from '../../Footer.module.scss'
import Text from 'components/Text'
import Accordian from 'components/Accordian'
import TalentsList from '../common/TalentsList'

const TalentsLink = (props: any) => {
  const { data } = props

  const { talents } = data?.foot || {}

  return (
    <Accordian
      paddedLine
      paddedContent
      dark={true}
      title={
        <Text textStyle='sm' className={styles.footerMobileLinkTitle}>
          {talents}
        </Text>
      }
    >
      <TalentsList data={data} />
    </Accordian>
  )
}

export default TalentsLink
