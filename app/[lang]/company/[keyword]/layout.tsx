
// import './flexible';
import Head from "next/head";
import {Metadata} from "next"

import {getCountryKey} from "../../../../helpers/country";
import {formatTemplateString} from "../../../../helpers/formatter";
import {getDictionary} from "../../../../get-dictionary";
import {cookies} from "next/headers";
import {fetchCompanyDetailReq, fetchCompanyHR, fetchConfigReq, fetchJobsListReq, getIDFromKeyword} from "./service";
import {configKey} from "../../../../helpers/cookies";
import {CompanyDetailsProvider} from "./DataProvider";
import { getCookie, removeUserCookie, setCookie } from 'helpers/cookies'
import { fetchHotJobsListService } from "store/services/jobs/fetchHotJobs";

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

export default async function CompanyLayout(props: {
	children: React.ReactNode;
	params: {
		keyword: string;
		lang: string;
	}
}) {
	// URL -> /shop/shoes/nike-air-max-97
	// `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
	const cookieStore = cookies()
	const token = cookieStore.get('accessToken')
	const id = getIDFromKeyword(props.params.keyword);
	try{
		const [jobs, detail, hr, hotJobs] = await Promise.all([
			fetchJobsListReq({companyIds: id,size: 10,page: 1},  token?.value), 
			fetchCompanyDetailReq(id), 
			fetchCompanyHR(id, token?.value),
			fetchHotJobsListService({company_id: id})
		]);
			// const configkey =cookieStore.get(configKey);
	// console.log('configkey', configkey);
	// const res1 = await fetchConfigReq(req.cookies[configKey]?.split('_')?.[1]);
	return (
		<>
			<CompanyDetailsProvider 
				hr={hr.data}
				initialDetail={detail.data} 
				initalJobs={jobs.data} 
				hotJobs={hotJobs.data.data}
				lang={props.params.lang}
			>
				<section style={{
					width: '100%',
					overflowX: 'clip',
					minHeight: '100vh',
					backgroundColor: '#ffffff',

				}}>
					<main>
						{props.children}
					</main>
				</section>
			</CompanyDetailsProvider>
		</>
	)
	}catch(e){
		return <div data-error={JSON.stringify(e)}>
			{e}
		</div>
	}

	

}