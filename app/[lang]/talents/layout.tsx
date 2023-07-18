
// import './flexible';
import Footer from './components/Footer'
import Head from "next/head";
import {Metadata} from "next"

import {useContext} from "react";
import {languageContext} from "../../components/providers/languageProvider";
import {getCountryKey} from "../../../helpers/country";
import {formatTemplateString} from "../../../helpers/formatter";
import {getDictionary} from "../../../get-dictionary";
import style from "./index.module.scss"
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

export default function ShopLayout(props: {
	children: React.ReactNode;
	params: {
		tag: string;
		item: string;
	}
}) {
	// URL -> /shop/shoes/nike-air-max-97
	// `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
	return (
		<>

			<section style={{
				// overflow: "hidden",
				overflowX: 'clip',
				minHeight: '100vh',
				backgroundColor: '#ffffff',

			}}
				className={style.page_container}
			>
				{/* <header> */}
				{/*     <h1>boosJob</h1> */}
				{/* </header> */}
				<main>
					{props.children}
				</main>
				<Footer/>
			</section>
		</>

	)
}