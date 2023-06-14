import Link from 'next/link';
import style from './index.module.scss';
import {getCountryKey, getLang} from 'helpers/country'
import { languageContext } from 'app/[lang]/components/providers/languageProvider'
import React, {useContext} from "react";
import {getCookie} from "../../../../../helpers/cookies";
import useWindowSize from "../../../../../hooks/useWindowSize";
import Accordian from 'components/Accordian'
import Text from "../../../../../components/Text";
import styles from "../../../../../components/Footer/Footer.module.scss";

const source = {
	"BpoJobs": "BPO jobs",
	"FAQ": "FAQ",
	"ItJobs": "IT jobs",
	"JobsIn1": "Jobs in Manila",
	"JobsIn2": "Jobs in Makati",
	"JobsIn3": "Jobs in Cebu",
	"about": "about",
	"aboutBossjob": "About Bossjob",
	"allJobs": "All jobs",
	"careerGuide": "Career guide",
	"corporation": "Philippines: Etos Adtech Corporation",
	"courses": "Courses",
	"createFree": "Create free resume",
	"createJobAlert": "Create job alert",
	"customerService": "Customer Service job",
	"downloadBossjobApp": "Download Bossjob App",
	"financeJobs": "Finance jobs",
	"followUs": "Follow us",
	"getStarted": "Get started",
	"healthcareJobs": "Healthcare jobs",
	"jobs": "jobs",
	"legal": "Legal",
	"popularJobs": "Popular Jobs",
	"recruiter": "Recruiter",
	"salesJobs": "Sales jobs",
	"talents": "Talents",
	"technology": "Singapore: Yolo Technology Pte Ltd. All Rights Reserved",
	"termsConditions": "Terms & Conditions"
}
const siteMap = [
	{
		"category": "About",
		"items": [
			{ "name": "About Bossjob", "link": "https://bossjob.com/about" },
			{ "name": "Terms & conditions", "link": "https://bossjob.com/terms" },
			{ "name": "Legal", "link": "https://bossjob.com/legal" },
			{ "name": "BossPoints", "link": "https://bossjob.com/bosspoints" },
			{ "name": "FAQ", "link": "https://bossjob.com/faq" },
			{ "name": "Sitemap", "link": "https://bossjob.com/sitemap" }
		]
	},
	{
		"category": "Talents",
		"items": [
			{ "name": "All jobs", "link": "https://bossjob.com/jobs" },
			{ "name": "Create job alert", "link": "https://bossjob.com/alert" },
			{ "name": "Create resume", "link": "https://bossjob.com/resume" },
			{ "name": "Career guide", "link": "https://bossjob.com/career-guide" },
			{ "name": "Courses", "link": "https://bossjob.com/courses" }
		]
	},
	{
		"category": "Recruiter",
		"items": [
			{ "name": "Get started", "link": "https://bossjob.com/recruiter" }
		]
	},
	{
		"category": "Popular Jobs",
		"items": [
			{ "name": "Jobs in Manila", "link": "https://bossjob.com/jobs/manila" },
			{ "name": "Jobs in Makati", "link": "https://bossjob.com/jobs/makati" },
			{ "name": "Jobs in Cebu", "link": "https://bossjob.com/jobs/cebu" },
			{ "name": "IT jobs", "link": "https://bossjob.com/jobs/it" },
			{ "name": "Finance jobs", "link": "https://bossjob.com/jobs/finance" },
			{ "name": "Customer service jobs", "link": "https://bossjob.com/jobs/customer-service" },
			{ "name": "BPO jobs", "link": "https://bossjob.com/jobs/bpo" },
			{ "name": "Sales jobs", "link": "https://bossjob.com/jobs/sales" },
			{ "name": "Healthcare jobs", "link": "https://bossjob.com/jobs/healthcare" }
		]
	},

]

const follow_use  =  [
	{img: `${process.env.S3_BUCKET_URL}/landing/facebook.svg`, link: 'https://www.facebook.com/Bossjobph'},
	{img: `${process.env.S3_BUCKET_URL}/landing/inlink.svg`, link: 'https://www.linkedin.com/company/bossjob-yolo-technology/'},
	{img: `${process.env.S3_BUCKET_URL}/landing/ins.svg`, link: 'https://www.instagram.com/Bossjobph'},
	{img: `${process.env.S3_BUCKET_URL}/landing/youtube.svg`, link: 'https://www.youtube.com/channel/UCszmY1TPgEyikxF9w2a2vdw'},
	{img: `${process.env.S3_BUCKET_URL}/landing/twitter.svg`, link: 'https://twitter.com/Bossjobph'},
	{img: `${process.env.S3_BUCKET_URL}/landing/tiktok.svg`, link: 'https://tiktok.com/@bossjobph'},
]

const Footer = () =>{
	const langKey = getLang();
	const contextLang =  useContext(languageContext);

	const isLogin = getCookie('accessToken') ? true : false

	const {
		about,
		aboutBossjob,
		termsConditions,
		legal,
		FAQ,
		talents,
		allJobs,
		createJobAlert,
		createFree,
		careerGuide,
		courses,
		recruiter,
		getStarted,
		popularJobs,
		ItJobs,
		financeJobs,
		customerService,
		BpoJobs,
		salesJobs,
		healthcareJobs,
		downloadBossjobApp,
		followUs,
		technology,
		corporation,
		JobsIn1,
		JobsIn2,
		JobsIn3,
		// @ts-ignore
	} = contextLang?.foot ||{}
	const countryKey = getCountryKey();
	const COUNTRY_MAP = {
		'ph': [
			{
				key: `/jobs-hiring/manila-jobs`,
				child: JobsIn1,
			},
			{
				key: `/jobs-hiring/makati-jobs`,
				child: JobsIn2
			},
			{
				key: `/jobs-hiring/cebu-jobs`,
				child: JobsIn3
			}
		],
		'sg': [
			{
				key: `/jobs-hiring/downtown-core-jobs`,
				child: JobsIn1,
			},
			{
				key: `/jobs-hiring/kallang-jobs`,
				child: JobsIn2
			},
			{
				key: `/jobs-hiring/jurong-east-jobs`,
				child: JobsIn3
			}
		]
	}
	const currentCounties = COUNTRY_MAP[countryKey]
	const colData =  [
			{
				title: about,
				links: [
					{
						key: `/company/bossjob-1668`,
						child: aboutBossjob
					},
					{
						key: `${process.env.BLOG_BOSSJOB}/terms-and-conditions/`,
						child: termsConditions
					},
					{
						key: `${process.env.BLOG_BOSSJOB}/terms-and-conditions/`,
						child: legal
					},
					{
						key: `${process.env.BOSS_BLOG_URL}/category/faq/`,
						child: FAQ
					}
				]
			},
			{
				title: talents,
				links: [
					{
						key: `/jobs-hiring/job-search`,
						child: allJobs
					},
					{
						key: `/jobs-hiring`,
						child: createJobAlert
					},
					{
						key: isLogin ? `/manage-profile?tab=resume` : `/resumetemplate`,
						child: createFree
					},
					{
						key: 'https://blog.bossjob.ph/category/career-advice/',
						child: careerGuide
					},
					{
						key: 'https://academy.bossjob.ph/courses/search-courses',
						child: courses
					}
				]
			},
			{
				title: recruiter,
				links: [
					{
						key: process.env.BOSSHUNT_URL,
						child: getStarted
					}
				]
			},
			{
				title: popularJobs,
				links: [
					...currentCounties,
					{
						key: `/jobs-hiring/information-technology-jobs?page=1`,
						child: ItJobs
					},
					{
						key: `/jobs-hiring/finance-audit-tax-jobs?page=1`,
						child: financeJobs
					},
					{
						key: `/jobs-hiring/customer-service-operations-jobs?page=1`,
						child: customerService
					},
					{
						key: `/jobs-hiring/bpo-jobs`,
						child: BpoJobs
					},
					{
						key: `/jobs-hiring/sales-jobs?page=1`,
						child: salesJobs
					},
					{
						key: `/jobs-hiring/healthcare-medical-jobs?page=1`,
						child: healthcareJobs
					}
				]
			}
		]
	const { width } = useWindowSize();
	const isMobile = width < 540;

	if(isMobile){
		return <div className={style.mobile_footer}>
			<div className={style.mobile_footer_container}>
				<div className={style.mobile_footer_title}>
					{downloadBossjobApp}
				</div>
				<div className={style.mobile_footer_download}>
					<Link href={'https://apps.apple.com/sg/app/bossjob/id1592073585'} target={'_blank'}>
						<img src={`${process.env.S3_BUCKET_URL}/landing/footer_download_apple.png`} alt="_"/>
					</Link>
					<Link href={'https://play.google.com/store/apps/details?id=com.poseidon.bossjobapp'} target={'_blank'}>
						<img src={`${process.env.S3_BUCKET_URL}/landing/footer_download_google.png`} alt="_"/>
					</Link>
				</div>
				<div className={style.mobile_list_container}>
					{
						colData.map((item, index) => {
							return  <Accordian
								key={index}
								paddedLine
								paddedContent
								dark
								title={
									<Text textStyle='sm' bold className={style.mobile_list_title}>
										<span className={style.mobile_list_title}>{item.title}</span>
									</Text>
								}
							>
								<ul className={styles.mobile_list}>
									{item.links.map((link, index) => {
										return (
											<li key={index}>
												<Link
													className={style.mobile_footer_link}
													href={link.key}
													title={link.child}>
													<Text textStyle='sm'>{link.child}</Text>
												</Link>
											</li>
										)
									})}
								</ul>
							</Accordian>
						})
					}
				</div>
				<div className={style.mobile_follow_us}>
					<div className={style.site_map_title}>{followUs}</div>
					<div className={style.site_map_follow}>
						{follow_use.map((item, index) => {
							return <Link href={item.link} target={'_blank'} key={index}>
								<img src={item.img} alt="img"/>
							</Link>
						})}
					</div>
				</div>
				<div className={style.site_copy_right}>
					Copyright © {new Date().getFullYear()}  {technology}
					<div style={{marginTop: 10}}>
						{corporation}
					</div>
				</div>
			</div>
			<div className={style.mobile_bg_wrapper}>
				{/* <MySvgComponent></MySvgComponent> */}
				<img src={require('./mobile-footer-bg.svg').default.src} alt={'bg'} className={style.mobile_bg}/>
			</div>
		</div>
	}
	return <div className={style.footer_container}>
		<img src={require('../AssetsLocal/footer-bg.jpg').default.src} alt={'bg'} className={style.bg}/>
		<div className={style.footer_title}>
			{downloadBossjobApp}
		</div>
		<div className={style.footer_download}>
			<Link href={'https://apps.apple.com/sg/app/bossjob/id1592073585'} target={'_blank'}>
				<img src={`${process.env.S3_BUCKET_URL}/landing/footer_download_apple.png`} alt="_"/>
			</Link>
			<Link href={'https://play.google.com/store/apps/details?id=com.poseidon.bossjobapp'} target={'_blank'}>
				<img src={`${process.env.S3_BUCKET_URL}/landing/footer_download_google.png`} alt="_"/>
			</Link>
			<img className={style.qrcode} src={`${process.env.S3_BUCKET_URL}/landing/footer_download_qrcode.png`} alt="_"/>
		</div>
		<div className={style.footer_site_map}>
			{colData.map((item, index) => {
				return <div className={style.site_map_col} key={index}>
					<div className={style.site_map_title}>{item.title}</div>
					{item.links.map((_item,index)=>{
						return (<Link className={style.site_map_link} target={'_blank'} href={_item.key} key={index}> {_item.child}</Link>)
					})}
				</div>
			})}
			<div className={style.site_map_col}>
				<div className={style.site_map_title}>{followUs}</div>
				<div className={style.site_map_follow}>
					{follow_use.map((item, index) => {
						return <Link href={item.link} target={'_blank'} key={index}>
							<img src={item.img} alt="img"/>
						</Link>
					})}
				</div>
			</div>
		</div>
		<div className={style.site_copy_right}>
			Copyright © {new Date().getFullYear()}  {technology}
			{corporation}
		</div>

	</div>
}

export default Footer;









