
// import './flexible';
import { Metadata } from "next"
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
import { buildComponentScript } from 'app/models/abstractModels/util'
import { getCountryKey } from "../../../helpers/country";
import { getDictionary } from "../../../get-dictionary";
import { cookies, headers } from "next/headers";
import { fetchUserOwnDetail } from "./service";

import { MangeProfileProvider } from "./DataProvider";
import Footer from "components/Footer/Footer";
import getConfigs from 'app/models/interpreters/config'
import { redirect } from 'next/navigation'
import { ConfigType } from 'app/types';


const configs = getConfigs([
	['location_lists'],
	['job_function_lists'],
	['turnover_lists'],
	['job_functions'],
	['company_types'],
	['company_benefit_lists'],
	['company_culture_lists'],
	['industry_lists'],
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
	props: { params: { lang: any } }
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

async function ManageProfileLayout(props: {
	children: React.ReactNode;
	params: {
		keyword: string;
		lang: string;
	},
	configs: { config: ConfigType }
}) {
	// URL -> /shop/shoes/nike-air-max-97
	// `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
	const cookieStore = cookies()
	const token = cookieStore.get('accessToken')
	if (!token?.value) {
		return redirect('/get-started?redirect=/manage-profile')
	}

	// if(isMobile && process.env.ENV === 'production'){
	// 	return redirect(`/${props.params.lang}/company_backup/${props.params.keyword}`)
	// }
	try {
		const [profile] = await Promise.all([
			fetchUserOwnDetail(token?.value)
		]);

	return (
			<MangeProfileProvider
        config={props.configs.config}
        profile={profile.data}
				token={token?.value}
      >
				<section style={{
					width: '100%',
					overflowX: 'hidden',
					minHeight: '100vh',
					backgroundColor: '#F5F7FB',

				}}>
					<main>
						{props.children}
					</main>
				</section>
				<Footer />
			</MangeProfileProvider>
		)
	} catch (e) {
		return <div data-error={JSON.stringify(e)}>
			{/* {e} */}
		</div>
	}



}

export default configs(serverDataScript().chain((configs) =>
	buildComponentScript({ configs }, ManageProfileLayout))
).run