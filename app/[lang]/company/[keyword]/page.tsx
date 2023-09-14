'use client';
import React, { useEffect } from 'react';
import style from './index.module.scss';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CompanyInfo, { padArrayToMultiple } from './components/InfoList';
import Section from "./components/Section";
import CulturePanel, { SocialMedia } from "./components/Culture";
import ChatPanel from "./components/ChatPanel";
import { useCompanyDetail } from "./DataProvider";
import SearchPanel, { JobsTag } from './components/SearchPanel';
import Link from 'next/link';
import Image from 'next/image';
import MobilePage from './page_mobile';
import useWindowSize from 'hooks/useWindowSize';
import { useContext } from 'react';
import { languageContext } from 'app/components/providers/languageProvider';
import { formatTemplateString } from 'helpers/formatter';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import { fetchViewCompany } from 'store/services/companies2/fetchViewCompany';
import { getCookie, removeCookie } from 'helpers/cookies';



function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			// role="tabpanel"
			// hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && children}
		</div>
	);
}

const Page = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const tabName = searchParams.get('tab');
	const [value, setValue] = React.useState(tabName === 'jobs' ? 1 : 0);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};
	const contextLang = useContext(languageContext);
	const { tab, overview } = contextLang.companyDetail

	const { detail, jobs, lang, hr, hotJobs, config, jobFunctions } = useCompanyDetail();
	const tab_title = [tab.CompanyInformation, `${tab.jobs}(${jobs.total_num})`];
	const { width } = useWindowSize();
	const isMobile = width < 767;

	const params = getCookie('view-company-buried')

	useEffect(() => {
		if (params) {
			const token = getCookie('accessToken')
			fetchViewCompany({ ...params, token }).then(() => {
				removeCookie('view-company-buried')
			})
		}
	}, [])

	if (isMobile) {
		return <MobilePage />
	}
	return <div className={style.container}>
		<div className={style.header}>
			{/* <Image className={style.header_cover} fill={true} src={detail.cover_pic_url} alt="cover" /> */}
			{/* <div className={style.header_cover}/> */}
			{/* <div className={style.header_mask}></div> */}
			<div className={style.header_info}>
				<div className={style.header_logo}>
					<Image className={style.header_logo_img} width={68} height={68} src={detail.logo_url} alt="logo" />
				</div>
				<div className={style.header_content}>
					<div className={style.header_title}>
						{detail.name}
						{detail.is_verify &&
							<Image width={24} height={24} className={style.header_title_verified}
								src={require('./components/assets/verify.svg').default.src}
								alt='_'
							/>}
					</div>
					<div className={style.header_subtitle}>
						{[detail.financing_stage, detail.company_size, detail.industry]
							.filter(Boolean)
							.map((value, index) => {
								return <span key={index} className={style.header_subtitle_item}>{value}</span>
							})
						}
					</div>
				</div>
				<div className={style.header_title_right}>
					<div className={style.header_title_num_wrapper}>
						<span className={style.header_title_num}>{jobs?.total_num}</span>
						<span className={style.header_title_string}>Jobs</span>
					</div>
					<div className={style.header_title_num_wrapper}>
						<span className={style.header_title_num}>{hr?.length}</span>
						<span className={style.header_title_string}>Boss</span>
					</div>
				</div>
			</div>
		</div>
		<div className={style.content}>
			<div className={style.tab_wrapper}>
				<div className={style.tab_layout}>
					<Tabs
						value={value} onChange={handleChange}
						classes={{
							indicator: "indicator"
						}}
						TabIndicatorProps={{ children: <span /> }}
					>
						<Tab label={tab_title[0]} {...a11yProps(0)} />
						<Tab label={tab_title[1]} {...a11yProps(1)} />
					</Tabs>
				</div>

			</div>
			<TabPanel value={value} index={0}>
				{!!hotJobs.jobs.length ?
					<div className={style.hot_jobs_wrapper}>
						<Section title={overview.HotJobs} hot>
							<div
								className={style.header_right}
								onClick={(e) => {
									handleChange(e, 1);
								}}
							>
								{formatTemplateString(overview.ViewAllJobs, { total_num: jobs.total_num })}
								<div className={style.arrow}></div>
							</div>
							<div className={style.jobs_item_layout}>
								{padArrayToMultiple(hotJobs.jobs.slice(0, 3))(3).map((item, index) => {
									if (!item) return <div key={index} className={style.jobs_item} style={{ opacity: 0 }} />;
									return <div className={style.jobs_item} key={index}>
										<Link
											href={`/${lang}${item.job_url}`}
											target={'_blank'}
											title={item.job_title}
											className={style.jobs_item_title}>
											{item.job_title}
										</Link>
										<div className={style.jobs_content}>
											<JobsTag {...item} count={2} style={{ flex: 1, overflow: 'hidden' }} />
											<div className={style.jobs_chat_now_container}>
												<div className={style.salary}>{
													item.local_salary_range_value
												}</div>
												<Link className={style.chat_now} target={'_blank'} href={`/${lang}${item.job_url}`}>
													{overview.jobs.card.chatNow}
												</Link>
											</div>
										</div>
									</div>
								})}
							</div>
						</Section>
					</div>
					: null}
				<div className={style.company_info_tab_wrapper}>
					<div className={style.company_info_wrapper}>
						<CompanyInfo {...detail} jobs={jobs.jobs} onMore={(e) => {
							window.scrollTo({
								top: 0,
								behavior: 'smooth'
							});
							setTimeout(() => {
								handleChange(e, 1)
							}, 300);
						}} />
						<div className={style.company_culture}>
							<CulturePanel {...detail} />
							{
								!!hr?.length && <>
									<div style={{ height: 40 }}></div>
									<ChatPanel list={hr} />
								</>
							}
							<div style={{ height: 40 }}></div>
							<SocialMedia {...detail} />
							<div style={{ height: 40 }}></div>
						</div>
					</div>
				</div>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<SearchPanel CountryList={config.location_lists} functions={jobFunctions} />
			</TabPanel>
		</div>
	</div>
}


export default Page;