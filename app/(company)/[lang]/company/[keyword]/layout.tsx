// import './flexible';
import { Metadata } from 'next'
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
import { buildComponentScript } from 'app/models/abstractModels/util'
import { getCountryKey } from '../../../../../helpers/country'
import { getDictionary } from '../../../../../get-dictionary'
import { cookies, headers } from 'next/headers'
import {
  fetchCompanyDetailReq,
  fetchCompanyHR,
  fetchJobsListReq,
  getIDFromKeyword
} from './service'
import { fetchJobsFunction } from '../../../../../store/services/jobs/fetchJobFunction'
import { CompanyDetailsProvider } from './DataProvider'
import { fetchHotJobsListService } from 'store/services/jobs/fetchHotJobs'
import Footer from 'components/Footer/Footer'
import getConfigs from 'app/models/interpreters/config'
import { redirect } from 'next/navigation'
import { ConfigType } from 'types/config';
import PublicLayout from 'app/components/publicLayout'

const configs = getConfigs([
  ['location_lists'],
  ['job_function_lists'],
  ['turnover_lists'],
  ['job_functions'],
  ['company_types'],
  ['company_benefit_lists'],
  ['company_culture_lists'],
  ['xp_lvls'],
  ['degrees'],
  ['job_types']
])
// eslint-disable-next-line valid-jsdoc
/**
 * Generate metadata for the page
 * @doc https://nextjs.org/docs/api-reference/data-fetching/getInitialProps
 */
async function generateSEO(props: { params: { lang: any } }): Promise<Metadata> {
  // read route params
  const dictionary = await getDictionary(props.params.lang)
  const country = dictionary.seo[getCountryKey()]
  const description = dictionary.seo?.landing?.description
  const regex = /\{\{([^}]+)\}\}/g
  const final_description = description.replace(regex, (_, match) => {
    return match.toLowerCase() === 'country' ? country : match
  })
  return {
    title: dictionary.seo?.landing?.title,
    description: final_description
  }
}

// async function CompanyLayout(props: {
//   children: React.ReactNode;
//   params: {
//     keyword: string;
//     lang: string;
//   },
//   configs: {
//     config: Partial<ConfigType>
//   }
// }) {
//   // URL -> /shop/shoes/nike-air-max-97
//   // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
//   const cookieStore = cookies()
//   const token = cookieStore.get('accessToken')
//   const id = getIDFromKeyword(props.params.keyword);
//   // const seo = generateSEO(props)
//   // if(isMobile && process.env.ENV === 'production'){
//   // 	return redirect(`/${props.params.lang}/company_backup/${props.params.keyword}`)
//   // }
//   try {
//     const [jobs, detail, hr, hotJobs, jobFunctions] = await Promise.all([
//       fetchJobsListReq({ companyIds: id, size: 10, page: 1 }, token?.value),
//       fetchCompanyDetailReq(id),
//       fetchCompanyHR(id, token?.value),
//       fetchHotJobsListService({ company_id: id }, token?.value),
//       fetchJobsFunction(id)
//     ])
//     if (detail?.data?.document) {
//       detail.data.document = null
//     }

//     if (!detail || !detail?.data) {
//       redirect(`/${props.params.lang}/404`)
//     }
//     const groupData = jobFunctions.data.data.reduce((result, obj) => {
//       const key = Object.values(obj)[0]
//       const value = Object.keys(obj)[0]
//       if (result[key as string]) {
//         result[key as string].push(value)
//       } else {
//         result[key as string] = [value]
//       }
//       return result
//     }, {})
//     const function_ids = Object.values(groupData).flat()
//     const jobClasses = props.configs.config.job_functions.filter((item) =>
//       function_ids.includes(String(item.id))
//     )

//     return (
//       <CompanyDetailsProvider
//         hr={hr.data}
//         detail={detail.data}
//         jobs={jobs.data}
//         hotJobs={hotJobs.data.data}
//         lang={props.params.lang}
//         config={props.configs.config}
//         jobFunctions={jobClasses}
//       >
//         <section
//           style={{
//             width: '100%',
//             overflowX: 'hidden',
//             minHeight: '100vh',
//             backgroundColor: '#ffffff'
//           }}
//         >
//           <main data-string={{}}>{props.children}</main>
//         </section>
//         <Footer />
//       </CompanyDetailsProvider>
//     )
//   } catch (e) {
//     redirect(`/${props.params.lang}/404`)
//     //  return <div data-error={JSON.stringify(e)}>{/* {e} */}11111</div>
//   }
// }

async function Layout(props: {
  children: React.ReactNode;
  params: {
    keyword: string;
    lang: string;
  },
  configs: {
    config: Partial<ConfigType>
  }
}) {
  const { children, ...rest } = props
  const seo = await generateSEO(props)
  const cookieStore = cookies()
  const token = cookieStore.get('accessToken')
  const id = getIDFromKeyword(props.params.keyword);

  try {
    const [jobs, detail, hr, hotJobs, jobFunctions] = await Promise.all([
      fetchJobsListReq({ companyIds: id, size: 10, page: 1 }, token?.value),
      fetchCompanyDetailReq(id),
      fetchCompanyHR(id, token?.value),
      fetchHotJobsListService({ company_id: id }, token?.value),
      fetchJobsFunction(id)
    ])
    if (detail?.data?.document) {
      detail.data.document = null
    }

    if (!detail || !detail?.data) {
      redirect(`/${props.params.lang}/404`)
    }
    const groupData = jobFunctions.data.data.reduce((result, obj) => {
      const key = Object.values(obj)[0]
      const value = Object.keys(obj)[0]
      if (result[key as string]) {
        result[key as string].push(value)
      } else {
        result[key as string] = [value]
      }
      return result
    }, {})
    const function_ids = Object.values(groupData).flat()
    const jobClasses = props.configs.config.job_functions.filter((item) =>
      function_ids.includes(String(item.id))
    )
    return (
      /* @ts-expect-error Async Server Component */
      <PublicLayout {...rest} seo={seo}>
        <CompanyDetailsProvider
          hr={hr.data}
          detail={detail.data}
          jobs={jobs.data}
          hotJobs={hotJobs.data.data}
          lang={props.params.lang}
          config={props.configs.config}
          jobFunctions={jobClasses}
        >
          <section
            style={{
              width: '100%',
              overflowX: 'hidden',
              minHeight: '100vh',
              backgroundColor: '#ffffff'
            }}
          >
            <main data-string={{}}>{children}</main>
          </section>
          <Footer />
        </CompanyDetailsProvider>
      </PublicLayout>
    )
  } catch (error) {
    redirect(`/${props.params.lang}/404`)
  }
}

export default configs(
  serverDataScript().chain((configs) => buildComponentScript({ configs }, Layout))
).run
