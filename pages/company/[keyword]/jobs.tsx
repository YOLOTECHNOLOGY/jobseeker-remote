// import React, { useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { useRouter } from 'next/router'

// @ts-ignore
import { END } from 'redux-saga'

// Redux Actions
import { wrapper } from 'store'
import { fetchCompanyDetailRequest } from 'store/actions/companies/fetchCompanyDetail'

// Components
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'
import MaterialTextField from 'components/MaterialTextField'
import MaterialLocationField from 'components/MaterialLocationField'
// import MaterialRoundedPagination from 'components/MaterialRoundedPagination'
import CompanyJobsCard from 'components/Company/CompanyJobsCard'

import CompanyProfileLayout from 'components/Company/CompanyProfileLayout'

// Styles
import styles from '../Company.module.scss'

const CompanyJobsProfile = (props: any) => {
  // const router = useRouter()
  // const dispatch = useDispatch()
  const { companyDetail } = props
  const company = companyDetail?.response.data

  // const [totalPages, setTotalPages] = useState(null)
  // setTotalPages(null)
  
  // console.log(company)

  // const handlePaginationClick = (event, val) => {
  //   router.query.page = val
  //   router.push(router, undefined, { shallow: true })
  // }

  return (
    <CompanyProfileLayout
      company={company}
      currentTab='jobs'
    >
      <div className={styles.companyTabsContent}>
        <div className={styles.companyJobs}>
          <div className={styles.companyJobsSearch}>
            <div className={styles.companyJobsSearchLeft}>
              <MaterialTextField 
                className={styles.companyJobsSearchTitle}
                size='small'
                label='Search for job title'
              />
            </div>
            <div className={styles.companyJobsSearchRight}>
              <MaterialLocationField
                className={styles.companyJobsSearchLocation}
                label='Location'
              />
              <MaterialButton variant='contained' capitalize className={styles.companyJobsSearchButton}>
                <Text textColor='white' bold>Search</Text>
              </MaterialButton>
            </div>
          </div>
          <Text textStyle='sm' className={styles.companyJobsFound}>1,023 jobs at {company.name}</Text>
          <div className={styles.companyJobsList}>
            {[...Array(7)].map((_,i) => {
              const dummy = {
                id: i,
                title: 'Operation Manager Lorem Ipsum',
                location: 'Manila',
                salary: '₱75k - ₱80k',
                availability: 'Full-time'
              }

              return <CompanyJobsCard {...dummy} key={i}/>
            })}
          </div>
          <Text textStyle='sm' className={styles.companyJobsResults}>Showing 1 - 30 of 1,024 jobs</Text>
          <div className={styles.companyJobsPagination}>
            {/* <MaterialRoundedPagination onChange={handlePaginationClick} defaultPage={1} totalPages={totalPages || 1} /> */}
          </div>
        </div>
      </div>
    </CompanyProfileLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const companyPageUrl = req.url.split('/')
  const companyPath = companyPageUrl.length === 4 ? companyPageUrl[2].split('-') : companyPageUrl[companyPageUrl.length - 1].split('-')
  const companyId = Number(companyPath[companyPath.length - 1])

  store.dispatch(fetchCompanyDetailRequest(companyId))
  store.dispatch(END)

  await (store as any).sagaTask.toPromise()
  const storeState = store.getState()
  const companyDetail = storeState.companies.companyDetail || null

  return {
    props: {
      companyDetail
    }
  }
})

export default CompanyJobsProfile