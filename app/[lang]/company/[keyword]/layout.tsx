
// import './flexible';
import Head from "next/head";
import {Metadata} from "next"
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
import { buildComponentScript } from 'app/models/abstractModels/util'
import {getCountryKey} from "../../../../helpers/country";
import {formatTemplateString} from "../../../../helpers/formatter";
import {getDictionary} from "../../../../get-dictionary";
import {cookies,headers} from "next/headers";
import {fetchCompanyDetailReq, fetchCompanyHR, fetchConfigReq, fetchJobsListReq, getIDFromKeyword, } from "./service";
import { fetchJobsFunction } from "../../../../store/services/jobs/fetchJobFunction";

import {configKey} from "../../../../helpers/cookies";
import {CompanyDetailsProvider} from "./DataProvider";
import { getCookie, removeUserCookie, setCookie } from 'helpers/cookies'
import { fetchHotJobsListService } from "store/services/jobs/fetchHotJobs";
import Footer from "components/Footer/Footer";
import getConfigs from 'app/models/interpreters/config'
import { redirect } from 'next/navigation'
import { serveIsMobile } from 'helpers/utilities'

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
	['job_types'],
])
// eslint-disable-next-line valid-jsdoc
/**
 * Generate metadata for the page
 * @doc https://nextjs.org/docs/api-reference/data-fetching/getInitialProps
 */
export async function generateMetadata(
	props:{params: { lang: any }}
): Promise<Metadata> {
	// read route params
	const dictionary = await getDictionary(props.params.lang);
	const country = dictionary.seo[getCountryKey()];
	const description = dictionary.seo?.landing?.description;
	const regex = /\{\{([^}]+)\}\}/g;
	const final_description = description.replace(regex, (_, match) => {
		return match.toLowerCase() === 'country' ? country : match;
	});
	return {
		title: dictionary.seo?.landing?.title,
		description: final_description,
	}
}

async function CompanyLayout(props: {
	children: React.ReactNode;
	params: {
		keyword: string;
		lang: string;
	},
	configs: any
}) {
	// URL -> /shop/shoes/nike-air-max-97
	// `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
	const cookieStore = cookies()
	const headeStore = headers()
	const token = cookieStore.get('accessToken')
	const id = getIDFromKeyword(props.params.keyword);

	// if(isMobile && process.env.ENV === 'production'){
	// 	return redirect(`/${props.params.lang}/company_backup/${props.params.keyword}`)
	// }
	try{
		const [jobs, detail, hr, hotJobs, jobFunctions] = await Promise.all([
			fetchJobsListReq({companyIds: id,size: 10,page: 1},  token?.value), 
			fetchCompanyDetailReq(id), 
			fetchCompanyHR(id, token?.value),
			fetchHotJobsListService({company_id: id}),
			fetchJobsFunction(id)
		]);

		const groupData = jobFunctions.data.data.reduce((result, obj) => {
			const key = Object.values(obj)[0];
			const value = Object.keys(obj)[0];
			if (result[key as string]) {
				result[key as string].push(value);
			} else {
				result[key as string] = [value];
			}
			return result;
		}, {});
		const function_ids = Object.values(groupData).flat();
		const jobClasses = props.configs.config.job_functions.filter((item) => function_ids.includes(String(item.id)))
			// const configkey =cookieStore.get(configKey);
	// console.log('configkey', configkey);
	// const res1 = await fetchConfigReq(req.cookies[configKey]?.split('_')?.[1]);
	return (
		<>
			<CompanyDetailsProvider 
				hr={hr.data}
				detail={detail.data} 
				jobs={jobs.data} 
				hotJobs={hotJobs.data.data}
				lang={props.params.lang}
				config={props.configs.config}
				jobFunctions={jobClasses}
			>
				<section style={{
					width: '100%',
					overflowX: 'hidden',
					minHeight: '100vh',
					backgroundColor: '#ffffff',

				}}>
					<main data-string={{}}>
						{props.children}
					</main>
				</section>
				<Footer/>
			</CompanyDetailsProvider>
		</>
	)
	}catch(e){
		return <div data-error={JSON.stringify(e)}>
			{/* {e} */}
		</div>
	}

	

}

export default configs(serverDataScript().chain((configs) =>
    buildComponentScript({ configs }, CompanyLayout))
).run