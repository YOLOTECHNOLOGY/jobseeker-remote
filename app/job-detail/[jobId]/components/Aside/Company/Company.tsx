import { Avatar, Button } from 'app/components/MUIs'

import styles from '../../../page.module.scss'

export type propsType = {
  name: string
  companySize: string
  financingStage: string
  logo: string
  numOfActiveJobs: number
  jobId: number
}

const Company = (company: propsType) => {
  return (
    <section className={styles.company}>
      <div className={styles.company_title}>company</div>
      <Avatar src={company.logo} sx={{ borderRadius: '5px', margin: '8px 0' }} />
      <h5 className={styles.company_name}>{company.name}</h5>
      <div className={styles.company_financingStage}>{company.financingStage}</div>
      <div className={styles.company_financingStage}>{company.companySize}</div>
      <Button
        variant='outlined'
        sx={{
          height: '44px',
          width: '100%',
          marginTop: '5px',
          borderRadius: '10px',
          border: '1px solid #136FD3',
          fontStyle: 'normal',
          fontWeight: 700,
          fontSize: '14px',
          lineHeight: '18px',
          letterSpacing: '0.0075em',
          color: '#136FD3'
        }}
      >
        View {company.numOfActiveJobs} jobs hiring
      </Button>
    </section>
  )
}

export default Company
