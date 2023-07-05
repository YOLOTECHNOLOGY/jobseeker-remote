'use client';
import * as React from 'react';
import style from './index.module.scss';
import SearchPanel, { JobsTag } from './components/SearchPanel';
import Link from 'next/link';
import Image from 'next/image';
import { useCompanyDetail } from "./DataProvider";
import useResponsiveFont from 'app/[lang]/talents/components/responseHook';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CompanyInfo from './components/InfoList';

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

const MobilePage = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const tabName = searchParams.get('tab');
	const [value, setValue] = React.useState(tabName === 'jobs' ? 1 : 0);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};
	const { detail, jobs, lang, hr, hotJobs, config, jobFunctions } = useCompanyDetail();

	useResponsiveFont(390, 767);
	const tab_title = ['Company information', `Jobs(${jobs.total_num})`];

	return <div className={style.container}>
		<div className={style.header}>
			<div className={style.header_cover_container}>
				<Image
					priority
					src={detail.cover_pic_url} className={style.header_cover} alt={'cover'} fill />
				<div className={style.header_logo}>
					<Image className={style.header_logo_img} fill src={detail.logo_url} alt="logo" />
				</div>
			</div>
		</div>
		<div className={style.header_title}>
			{detail.name}
			{detail.is_verify &&
				<Image width={16} height={16} className={style.header_title_verified}
					src={require('./components/assets/verify.svg').default.src}
					alt='_'
				/>}
		</div>
		<div className={style.header_subtitle}>
			{[detail.financing_stage, detail.company_size, detail.industry].filter(Boolean).join(' | ')}
		</div>
		<div className={style.header_benefit_wrapper}>
			{
				detail.benefits.slice(0, 3).map((item, index) => {
					return <div key={index} className={style.header_benefit_item}>
						{item.value}
					</div>
				})
			}
		</div>
		<div className={style.split}></div>
		<div className={style.tab_layout}>
					<Tabs value={value} onChange={handleChange}>
						<Tab label={tab_title[0]} {...a11yProps(0)} />
						<Tab label={tab_title[1]} {...a11yProps(1)} />
					</Tabs>
				</div>
		<div className={style.split}></div>
		<TabPanel value={value} index={0}>
			<CompanyInfo {...detail} jobs={jobs.jobs} onMore={(e) => {
							window.scrollTo({
								top: 0,
								behavior: 'smooth'
							});
							setTimeout(() => {
								handleChange(e, 1)
							}, 300);
						}} ></CompanyInfo>
		</TabPanel>
		<TabPanel value={value} index={1}>
			<SearchPanel CountryList={config.location_lists} functions={jobFunctions} />
		</TabPanel>
	</div>
}


export default MobilePage;