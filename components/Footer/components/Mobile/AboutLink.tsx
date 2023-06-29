import React from 'react'
import styles from '../../Footer.module.scss'
import Text from 'components/Text'
import Accordian from 'components/Accordian'
import AboutList from '../common/AboutList'

const AboutLink = (props: any) => {
  const { data } = props

  const { about } = data?.foot || {}

  return (
    <Accordian
      paddedLine
      paddedContent
      dark={true}
      title={
        <Text textStyle='sm' className={styles.footerMobileLinkTitle}>
          {about}
        </Text>
      }
    >
      <AboutList data={data} />
    </Accordian>
  )
}

export default AboutLink
