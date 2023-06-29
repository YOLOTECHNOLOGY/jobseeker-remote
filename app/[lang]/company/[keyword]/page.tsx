'use client';
import * as React from 'react';
import style from './index.module.scss';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CompanyInfo from './components/InfoList';
import Section from "./components/Section";
import CulturePanel, { SocialMedia } from "./components/Culture";
import ChatPanel from "./components/ChatPanel";
import {useCompanyDetail} from "./DataProvider";
import { fetchConfigService } from 'store/services/config/fetchConfig';
import { Country, JobClasses } from './service';
import SearchPanel, { JobsTag } from './components/SearchPanel';
import Link from 'next/link';
import Image from 'next/image';
import {fetchJobsFunction} from "../../../../store/services/jobs/fetchJobFunction";

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
	const {children, value, index, ...other} = props;

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
	const [list, setList] = React.useState<Country[]>([]);
	const [functions, setFunctions] = React.useState<JobClasses[]>([]);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};
	const {detail, jobsRes, lang, hr, hotJobs} = useCompanyDetail();
	const tab_title = ['Company information', `Jobs(${jobsRes.total_num})`];
	React.useEffect(()=>{
		(async ()=>{
			const res = await fetchConfigService(lang);
			const _res = await fetchJobsFunction(detail.id);
			const groupData = _res.data.data.reduce((result, obj) => {
				const key = Object.values(obj)[0];
				const value = Object.keys(obj)[0];
				if (result[key as string]) {
					result[key as string].push(value);
				} else {
					result[key as string] = [value];
				}
				return result;
			}, {});
			const functionMap = {};
			res.job_function_lists.map((item)=>{
				functionMap[Object.keys(item)[0]] = Object.values(item)[0]  
			});
			const jobClasses = Object.keys(groupData).map((key)=>{
				return functionMap[key]?.filter((item)=>{
					return groupData[key]?.includes(String(item.id))
				});
			}).flat();
			setList(res.location_lists)
			setFunctions(jobClasses)
		})();
	},[]);
	return <div className={style.container}>
		<div className={style.header}>
			<Image className={style.header_cover} fill={true} src={detail.cover_pic_url} alt="cover"/>
			<div className={style.header_mask}></div>
			<div className={style.header_info}>
				<div className={style.header_logo}>		
					<Image className={style.header_logo_img} width={68} height={68} src={detail.logo_url} alt="logo" />
				</div>
				<div className={style.header_content}>
					<div className={style.header_title}>
						{detail.name} 
						{detail.is_verify && 
						<Image width={16} height={16} className={style.header_title_verified}
							 src={require('./components/assets/verify.svg').default.src}
							 alt='_'
						/>}
					</div>
					<div className={style.header_subtitle}>
						{[detail.financing_stage,detail.company_size,detail.industry].filter(Boolean).join(' | ')}
					</div>
					<div className={style.header_benefit_wrapper}>
						{
							detail.benefits.map((item, index) => {
								return <div key={index} className={style.header_benefit_item}>
									{item.value}
								</div>
							})
						}
					</div>
				</div>
			</div>
		</div>
		<div className={style.content}>
			<div className={style.tab_wrapper}>
				<div className={style.tab_layout}>
					<Tabs value={value} onChange={handleChange}>
						<Tab label={tab_title[0]} {...a11yProps(0)} />
						<Tab label={tab_title[1]} {...a11yProps(1)} />
					</Tabs>
				</div>

			</div>
			<TabPanel value={value} index={0}>
				<div className={style.company_info_tab_wrapper}>
					{!!hotJobs.jobs.length ? 	<Section title={'Hot Jobs'} hot>
						<div 
								className={style.header_right} 
								onClick={(e)=>{
									handleChange(e,1);
								}}
						>
							All {jobsRes.total_num} jobs <div className={style.arrow}></div>
						</div>
						<div className={style.jobs_item_layout}>
							{hotJobs.jobs.slice(0,3).map((item)=>{
								return <div className={style.jobs_item} key={item.job_title}>
								<div className={style.jobs_item_title}>
									{item.job_title}
								</div>
								<div className={style.jobs_content}>
									<JobsTag {...item} count={2}/>
									<div className={style.jobs_chat_now_container}>
										<div className={style.salary}>{
											item.local_salary_range_value
										}</div>
										<Link className={style.chat_now} target={'_blank'} href={`/${lang}${item.job_url}`}>
											Chat Now
										</Link>
									</div>
								</div>
							</div>
							})}
						</div>
					</Section>: 0}	
					<div className={style.company_info_wrapper}>
						<CompanyInfo {...detail} jobs={jobsRes.jobs} onMore={(e)=>{
							window.scrollTo({
									top: 0,
									behavior: 'smooth'
							});
							setTimeout(()=>{
								handleChange(e,1)
							},300);
						}} />
						{/* <div className={style.more_job}>
							More {jobsRes.total_num} Jobs
						</div> */}
						<div className={style.company_culture}>
							<CulturePanel {...detail}/>
							{
								hr?.length  && <>
									<div style={{height: 40}}></div>
									<ChatPanel list={hr}/>
								</>
							}
							<div style={{height: 40}}></div>
							<SocialMedia {...detail}/>
							<div style={{height: 40}}></div>
						</div>
					</div>
				</div>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<SearchPanel list={list} functions={functions} />
			</TabPanel>
		</div>
		{/* <div className={style.footer}>
			Copyright © 2016-{new Date().getFullYear()}&nbsp;Singapore: Yolo Technology Pte Ltd. All Rights Reserved.
      <span>Philippines: Etos Adtech Corporation</span>
		</div> */}
	</div>
}


export default Page;