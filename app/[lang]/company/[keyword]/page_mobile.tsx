'use client';
import * as React from 'react';
import style from './index.module.scss';
import SearchPanel, { JobsTag } from './components/SearchPanel';
import Link from 'next/link';
import Image from 'next/image';
import { useCompanyDetail } from "./DataProvider";
import useResponsiveFont from 'app/[lang]/talents/components/responseHook';

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
	
	const { detail, jobs, lang, hr, hotJobs, config, jobFunctions } = useCompanyDetail();
	useResponsiveFont(390,767);
	return <div className={style.container}>
    
	</div>
}


export default MobilePage;