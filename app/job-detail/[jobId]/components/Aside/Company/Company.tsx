'use client'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'

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
    <section>
      <div>company</div>
      <Avatar src={company.logo} />
      <h5>{company.name}</h5>
      <span>{company.financingStage}</span>
      <span>{company.companySize}</span>
      <Button variant='contained'>{company.numOfActiveJobs}</Button>
    </section>
  )
}

export default Company
