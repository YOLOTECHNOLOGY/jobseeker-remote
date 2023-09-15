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
import { formatTemplateString } from 'helpers/formatter'

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
 * 
 * Note： the below form is just for SEO's company details page, the name parameter must be replaced with 'company name'
{
  title:  Working at {{name}} | Bossjob
  description:  Discover new career opportunities at {{name}}. Learn more about {{name}}'s employee benefits, company culture and job openings on Bossjob. Apply for jobs now!
 }
 */
async function generateSEO(props: { params: { lang: any } }, companyName = ''): Promise<Metadata> {
  // read route params
  const dictionary = await getDictionary(props.params.lang)
  const { detailDescription = '', detailTitle = '' } = dictionary.seo?.company || {}

  return {
    title: formatTemplateString(detailTitle, { companyName }),
    description: formatTemplateString(detailDescription, { companyName })
  }
}

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
    const seo = await generateSEO(props, detail.data.legal_name)

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
