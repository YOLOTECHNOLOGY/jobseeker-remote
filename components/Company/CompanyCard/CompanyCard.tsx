// Components
import Text from 'components/Text'
import Link from 'components/Link'

// Styles
import styles from './CompanyCard.module.scss'

const CompanyCard = () => {
  return (
    <div className={styles.companyCard}>
      <div className={styles.companyCardLeft}>
        <img src={'https://media-exp1.licdn.com/dms/image/C5622AQF86NdHODat6A/feedshare-shrink_2048_1536/0/1637301937054?e=1648684800&v=beta&t=KALP14fh0OydAyv8omGuNfb8k5SawWEx6QQkAUqpIK8'} alt="" className={styles.companyCardImage}/>
      </div>
      <div className={styles.companyCardRight}>
        <Link to='/companies' className={styles.companyCardName}>
          <Text textStyle='xl' bold tagName='p'>Loop Contact Solutions Inc.</Text>
        </Link>
        <Text textStyle='lg' tagName='p' className={styles.companyCardCategory}>Information Technology</Text>
        <Link to='/companies' className={styles.companyCardOpenings}>
          <Text textStyle='lg' bold>View 59 job openings</Text>
        </Link>
      </div>
    </div>
  )
}

export default CompanyCard